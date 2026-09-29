# dsh-wsl-git

> **语言：** **中文**（本页） · [English](./README.en.md)

截断版 git status / diff --stat，避免巨型 diff 灌上下文。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-git
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-git
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `git_tool_status` | git 是否可用 |
| `git_status_summary` | status -sb + 变更数 |
| `git_diff_stat` | 仅 --stat |

## 配置要点

`allowRoots / timeoutMs`

不提供 commit / push。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-git` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |

## License

MIT
