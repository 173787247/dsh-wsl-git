# dsh-wsl-git

> **Languages:** [中文（首页）](./README.md) · **English** (this file)

Capped git status / diff --stat (no full patches).

| | |
|---|---|
| Version | **0.1.0** |
| Kit | Optional companion to [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit); not in `install.sh` |

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-git
```

Batch link (optional): `bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## Tools

| Tool | Role |
|------|------|
| `git_tool_status` | git on PATH |
| `git_status_summary` | short status + count |
| `git_diff_stat` | diff --stat only |

## Config

`allowRoots / timeoutMs`

No commit/push.

## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-git` **0.1.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.0-rc.2`**) — single source of truth for the suite |
| **Kit set** | optional (not in `install.sh` / `KIT_SET=daily` by default) |

## License

MIT
