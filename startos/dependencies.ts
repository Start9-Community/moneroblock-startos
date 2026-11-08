import { sdk } from './sdk'
export const dependencies = sdk.Dependencies.of().addDependency(
  sdk.Dependency.required('monerod', {
    description: {
      en_US: 'Provides blockchain data through restricted RPC',
      es_ES: 'Proporciona datos de la cadena mediante RPC restringido',
      de_DE: 'Stellt Blockchain-Daten über eingeschränktes RPC bereit',
      fr_FR: 'Fournit les données de la blockchain via le RPC restreint',
      pl_PL: 'Udostępnia dane łańcucha przez ograniczony interfejs RPC',
    },
    metadata: {
      title: 'Monero',
      icon: 'https://raw.githubusercontent.com/Start9-Community/monerod-startos/8add8fa5144a2ebd971f05740023393290ef9ff1/icon.svg',
    },
    versionRange: '>=0.18.5.4:3',
    kind: 'running',
    healthChecks: ['monerod'],
  }),
)
