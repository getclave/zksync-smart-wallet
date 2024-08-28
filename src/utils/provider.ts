import { CONFIG } from '@/utils/config';
import { Provider } from 'zksync-ethers';

export const SEPOLIA_RPC_URL = 'https://sepolia.era.zksync.dev';
export const MAINNET_RPC_URL = 'https://mainnet.era.zksync.io';

export const SepoliaProvider = new Provider(SEPOLIA_RPC_URL);
export const MainnetProvider = new Provider(MAINNET_RPC_URL);

export const RPC_URL =
    CONFIG.chainId === 324 ? MAINNET_RPC_URL : SEPOLIA_RPC_URL;

export const ZKsyncProvider =
    CONFIG.chainId === 324 ? MainnetProvider : SepoliaProvider;
