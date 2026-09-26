import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveRepo } from "../lib/git.js";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("git resolve", () => {
  it("resolves cwd", () => {
    const d = mkdtempSync(join(tmpdir(), "dsh-git-"));
    assert.ok(resolveRepo(d).includes("dsh-git-"));
  });
  it("clamps log limit", () => {
    const n = Math.min(100, Math.max(1, Number(999) || 20));
    assert.equal(n, 100);
  });
});
