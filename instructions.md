# MoneroBlock

## Documentation

- [MoneroBlock](https://github.com/duggavo/MoneroBlock) — the upstream project and its README.

## What you get on StartOS

A block and transaction explorer for your own Monero node, opened from the **Web UI**
interface. Every lookup goes to your node, so nothing you search for leaves your server.

## Getting set up

1. Install Monero and let it finish syncing.
2. Start MoneroBlock and open **Web UI**.

The home page lists the most recent blocks. Search by block height, block hash or
transaction hash.

If you set or change an RPC username and password in Monero's configuration, MoneroBlock
picks it up and restarts on its own.

## Troubleshooting

If the explorer opens but pages fail to load, the **Monero RPC** health check says so. Check
that Monero is running and synced. Transaction details a pruned Monero node no longer keeps
cannot be shown.
