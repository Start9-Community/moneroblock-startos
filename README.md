<p align="center">
  <img src="icon.svg" alt="MoneroBlock Logo" width="21%" />
</p>

# MoneroBlock on StartOS

> Everything not listed in this document should behave the same as upstream
> MoneroBlock. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[MoneroBlock](https://github.com/duggavo/MoneroBlock) is a lightweight block and
transaction explorer. This package points it at the restricted RPC of the Monero
service on the same server.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The image is built from this repo's `Dockerfile`: a static Go binary compiled from
the `upstream/` submodule with `patches/startos-rpc.patch` applied, on an Alpine
base. It is built for x86_64 and aarch64.

| Subcontainer  | Runs                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| `moneroblock` | `/usr/local/bin/moneroblock --bind 0.0.0.0:31312 --daemon <Monero restricted RPC>`, as `nobody` |

The RPC login, when Monero has one, is passed in the `MONEROBLOCK_RPC_LOGIN`
environment variable rather than on the command line.

## Volume and Data Layout

MoneroBlock stores nothing on disk; its recent-block list is held in memory and
rebuilt from Monero on every start.

| Resource                | Where                                                | Purpose                                 |
| ----------------------- | ---------------------------------------------------- | --------------------------------------- |
| Own volumes             | None                                                 | —                                       |
| Monero's `monerod` volume | Mounted read-only into the package's own runtime, never into the explorer | Reading `monero.conf` for the RPC login |

The explorer never sees Monero's blockchain files.

## File Models

None. The package writes no configuration. It reads `rpc-login` from Monero's
`monero.conf` through Monero's own file model, so a value is interpreted exactly as
the Monero package writes it.

## Dependencies

The package has one dependency, required in every configuration.

| Dependency | Required | Must be healthy | Mount                               | Why                                          |
| ---------- | -------- | --------------- | ----------------------------------- | -------------------------------------------- |
| Monero     | Yes      | `monerod`       | `monerod` volume, read-only, package runtime only | Blockchain data over restricted RPC; RPC login |

## Network Access and Interfaces

The package exposes one interface and connects to nothing but Monero.

| Interface | Type | Port  | Protocol | Purpose               |
| --------- | ---- | ----- | -------- | --------------------- |
| `ui`      | `ui` | 31312 | HTTP     | The explorer web pages |

Outbound, it calls Monero's restricted RPC (port 18089) over the bridge address.
It does not use the unrestricted RPC, wallet RPC, or any remote node.

## Installation and First-Run Flow

Nothing to set up: there is no account, wizard, or credential of its own. The
explorer starts once Monero is running and healthy, and the home page fills with
recent blocks within a few seconds.

When Monero's RPC login is added, changed, or removed, MoneroBlock restarts on its
own with the new value.

## Actions

None.

## Tasks

None. The service is never held on a prompt.

## Health Checks

Two checks; the second is the one that tells you whether the explorer is useful.

| Check         | Probes                                       | Failure means                                                                                       |
| ------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `moneroblock` | Port 31312 is listening                      | The explorer process is not up; read the service log.                                               |
| `monero-rpc`  | The home page loads, which calls Monero's RPC | Monero is stopped, still starting, or rejecting the login. Check Monero's own health first; a wrong login shows as `401` in the explorer's log. |

## Backups and Restore

There is nothing to back up: the package has no volumes, so its backup is empty and a
restore only reinstalls it. Monero's data is in Monero's own backup.

## Limitations and Differences

1. The explorer shows only what the connected node holds; transaction details a
   pruned node no longer has cannot be displayed.
2. The web pages are in English only; StartOS labels and descriptions are localized.
3. The carried patch adds Digest authentication (upstream sends no credentials),
   reads the login from the environment, fixes upstream's swapped username and
   password and its truncation of passwords containing `:`, handles chains shorter
   than 51 blocks, makes the recent-block cache thread-safe, and keeps refreshing it
   after an RPC error instead of crashing.

---

## Quick Reference for AI Consumers

```yaml
package_id: moneroblock
image: built from Dockerfile (upstream submodule + patches/)
architectures: [x86_64, aarch64]
subcontainers: [moneroblock]
volumes: {}
file_models: []
startos_managed_env_vars:
  - MONEROBLOCK_RPC_LOGIN
dependencies: [monerod]
interfaces:
  ui: { type: ui, port: 31312 }
actions: []
tasks: []
health_checks:
  - moneroblock
  - monero-rpc
```
