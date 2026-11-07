# Carried patches

`startos-rpc.patch` is applied to the `upstream/` submodule by the Dockerfile. It:

- sends the RPC login with Digest authentication, read from `MONEROBLOCK_RPC_LOGIN`;
- splits the login at the first `:` only, with username first;
- bounds the recent-block range on a chain shorter than 51 blocks;
- guards the recent-block cache with a mutex and retries a failed refresh;
- drops the unused Fiber dependencies from `go.mod` and adds the `go.sum` upstream lacks.

Drop a hunk once upstream ships the equivalent.
