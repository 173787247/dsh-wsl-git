import { gitStatusSummary, gitDiffStat, gitLogOneline, gitToolStatus } from "./lib/git.js";

export const name = "dsh-wsl-git";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-git] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-git] allowRoots=${allowRoots.length || "any"}`);

  ctx.systemPrompt.section({
    name: "tool:git-summary",
    order: 132,
    text: "dsh-wsl-git exposes git_status_summary, git_log_oneline, and git_diff_stat with capped output. Prefer these over dumping full diffs into context. Does not run commit/push.",
  });

  ctx.tools.register({
    name: "git_tool_status",
    description: "Whether git is on PATH; version string.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return { ...(await gitToolStatus()), allowRootsCount: allowRoots.length };
    },
    presentCall: () => ({ card: "generic", title: "git tool" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git tool", content: r.content }),
  });

  ctx.tools.register({
    name: "git_status_summary",
    description: "Short git status (-sb) + changed file count for a repo. Caps size.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["cwd"],
      properties: { cwd: { type: "string", description: "Git work tree path" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `repo=${v.repo}\nbranch=${v.branch}\nchangedFiles=${v.changedFiles}\n${v.status}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await gitStatusSummary({ cwd: args.cwd, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "git status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git status", content: r.content }),
  });

  ctx.tools.register({
    name: "git_log_oneline",
    description: "git log --oneline -n N (capped, default 20, max 100). Read-only.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["cwd"],
      properties: {
        cwd: { type: "string" },
        limit: { type: "number", description: "Commit count (default 20, max 100)" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.log || "(empty)" }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await gitLogOneline({ cwd: args.cwd, limit: args.limit, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "git log" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git log", content: r.content }),
  });

  ctx.tools.register({
    name: "git_diff_stat",
    description: "git diff --stat (or --cached) only — never full patch. Caps size.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["cwd"],
      properties: {
        cwd: { type: "string" },
        staged: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stat }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await gitDiffStat({
          cwd: args.cwd,
          staged: args.staged === true,
          allowRoots,
          timeoutMs,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "git diff --stat" }),
    presentResult: (_a, r) => ({ card: "generic", title: "git diff --stat", content: r.content }),
  });
}

function positive(v, fb) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fb;
}
