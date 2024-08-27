import { Provider } from "zksync-ethers";

export const RPC_URL = "https://sepolia.era.zksync.dev";
export const SepoliaProvider = new Provider(RPC_URL);

export const ZKsyncProvider = SepoliaProvider;
