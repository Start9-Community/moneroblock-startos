export const DEFAULT_LANG = 'en_US'
const dict = {
  'Web UI': 0,
  'Local Monero blockchain explorer': 1,
  Explorer: 2,
  'Explorer is listening': 3,
  'Explorer is not listening': 4,
  'Monero restricted RPC is not available': 5,
  'Monero RPC': 6,
  'Reading the blockchain from Monero': 7,
  'Cannot read from Monero. Check that it is running and synced.': 8,
} as const
export type LangDict = Record<(typeof dict)[keyof typeof dict], string>
export default dict
