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

## License

MIT
