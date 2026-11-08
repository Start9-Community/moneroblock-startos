# Updating the upstream version

Upstream is the `upstream/` git submodule, pinned to a release tag of
[duggavo/MoneroBlock](https://github.com/duggavo/MoneroBlock).

## Determining the upstream version

The pinned tag is `git -C upstream describe --tags`. The latest is the highest tag in
`git ls-remote --tags https://github.com/duggavo/MoneroBlock.git`; upstream publishes no
GitHub releases.

## Applying the bump

1. `git -C upstream fetch --tags && git -C upstream checkout <tag>`, then stage `upstream`.
2. Rebase `patches/startos-rpc.patch` onto the new source and confirm it applies without fuzz;
   drop any hunk upstream has made redundant (see `patches/README.md`).
3. Set the upstream part of `version` in `startos/versions/current.ts` to the tag without its
   leading `v`.
