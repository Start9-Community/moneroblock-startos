import { moneroConfFile } from 'monerod-startos/startos/fileModels/monero.conf'
import {
  rpcRestrictedHostId,
  rpcRestrictedPort,
} from 'monerod-startos/startos/utils'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { monerodMountpoint, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const address = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'monerod',
      hostId: rpcRestrictedHostId,
      internalPort: rpcRestrictedPort,
      ssl: false,
    })
    .const()
  if (!address) throw new Error(i18n('Monero restricted RPC is not available'))

  await sdk.mount(effects, {
    location: monerodMountpoint,
    target: {
      packageId: 'monerod',
      volumeId: 'monerod',
      subpath: null,
      readonly: true,
      idmap: [],
    },
  })
  const rpcLogin = await moneroConfFile
    .withPath(`${monerodMountpoint}/monero.conf`)
    .read(({ 'rpc-credentials': c }) =>
      c?.selection === 'enabled' && c.value?.username
        ? `${c.value.username}:${c.value.password ?? ''}`
        : null,
    )
    .const(effects)

  return sdk.Daemons.of(effects)
    .addDaemon('moneroblock', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'moneroblock' },
        null,
        'moneroblock',
      ),
      exec: {
        command: [
          '/usr/local/bin/moneroblock',
          '--bind',
          `0.0.0.0:${uiPort}`,
          '--daemon',
          `http://${address}`,
        ],
        env: rpcLogin ? { MONEROBLOCK_RPC_LOGIN: rpcLogin } : {},
        user: 'nobody',
      },
      ready: {
        display: i18n('Explorer'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('Explorer is listening'),
            errorMessage: i18n('Explorer is not listening'),
          }),
      },
      requires: [],
    })
    .addHealthCheck('monero-rpc', {
      ready: {
        display: i18n('Monero RPC'),
        fn: () =>
          sdk.healthCheck.checkWebUrl(effects, `http://127.0.0.1:${uiPort}/`, {
            successMessage: i18n('Reading the blockchain from Monero'),
            errorMessage: i18n(
              'Cannot read from Monero. Check that it is running and synced.',
            ),
          }),
      },
      requires: ['moneroblock'],
    })
})
