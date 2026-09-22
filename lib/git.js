import { spawn } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { resolve } from "node:path";

export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
}

export function resolveRepo(cwd, allowRoots = []) {
  const abs = resolve(String(cwd || ".").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  if (allowRoots.length) {
    const roots = allowRoots.map((r) => {
      const a = resolve(r);
      return existsSync(a) ? realpathSync(a) : a;
    });
    const ok = roots.some((root) => {
      const r = root.replace(/[/\\]+$/, "");
      return real === r || real.startsWith(r + "/") || real.startsWith(r + "\\");
    });
    if (!ok) throw new Error(`repo outside allowRoots: ${real}`);
  }
  return real;
}

export function runGit(repo, args, timeoutMs = 20_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("git", ["-C", repo, ...args], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("git timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 400_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export async function gitStatusSummary({ cwd, allowRoots, timeoutMs, maxOut = 12_000 }) {
  const repo = resolveRepo(cwd, allowRoots);
  const bin = (await which("git")) || "git";
  if (!(await which("git"))) {
    /* still try git on PATH via spawn */
  }
  void bin;
  const branch = await runGit(repo, ["rev-parse", "--abbrev-ref", "HEAD"], timeoutMs);
  const short = await runGit(repo, ["status", "-sb", "--untracked-files=no"], timeoutMs);
  const porcelain = await runGit(repo, ["status", "--porcelain"], timeoutMs);
  if (short.code !== 0) throw new Error(`git status failed: ${short.stderr || short.code}`);
  const lines = porcelain.stdout.split("\n").filter(Boolean);
  const summary = short.stdout.slice(0, maxOut);
  return {
    ok: true,
    repo,
    branch: branch.code === 0 ? branch.stdout.trim() : null,
    changedFiles: lines.length,
    status: summary,
    truncated: short.stdout.length > maxOut,
  };
}

export async function gitDiffStat({ cwd, allowRoots, timeoutMs, staged = false, maxOut = 8_000 }) {
  const repo = resolveRepo(cwd, allowRoots);
  const args = staged ? ["diff", "--cached", "--stat"] : ["diff", "--stat"];
  const { code, stdout, stderr } = await runGit(repo, args, timeoutMs);
  if (code !== 0) throw new Error(`git diff --stat failed: ${stderr || code}`);
  return {
    ok: true,
    repo,
    staged: !!staged,
    truncated: stdout.length > maxOut,
    stat: stdout.slice(0, maxOut),
  };
}
