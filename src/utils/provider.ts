import { Provider } from 'zksync-ethers';

export const SEPOLIA_RPC_URL = 'https://sepolia.era.zksync.dev';
export const MAINNET_RPC_URL = 'https://mainnet.era.zksync.io';

export const SepoliaProvider = new Provider(SEPOLIA_RPC_URL);
export const MainnetProvider = new Provider(MAINNET_RPC_URL);

export const ZKsyncProvider = SepoliaProvider;
