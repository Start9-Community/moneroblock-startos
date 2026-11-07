import { short, long } from './i18n'
import { setupManifest } from '@start9labs/start-sdk'
export const manifest = setupManifest({
  id: 'moneroblock',
  title: 'MoneroBlock',
  license: 'BSD-3-Clause',
  packageRepo: 'https://github.com/Start9-Community/moneroblock-startos',
  upstreamRepo: 'https://github.com/duggavo/MoneroBlock',
  marketingUrl: 'https://github.com/duggavo/MoneroBlock',
  donationUrl: null,
  description: { short, long },
  volumes: [],
  images: {
    moneroblock: { source: { dockerBuild: {} }, arch: ['x86_64', 'aarch64'] },
  },
})
