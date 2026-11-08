# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

- Clone with `--recurse-submodules`. Never commit changes inside `upstream/`; carry them in
  `patches/startos-rpc.patch`, which the Dockerfile applies at build time.
- Regenerate the patch from a scratch copy of the pinned upstream with the patch applied,
  `git add -N go.sum` before `git diff`: the patch creates `go.sum`, and a plain diff drops it.
