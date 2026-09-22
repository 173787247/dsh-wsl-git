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
});
