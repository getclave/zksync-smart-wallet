import { CONFIG } from '@/utils/config';

export type Token = {
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    icon: string;
    type: 'native' | 'ERC20';
};

const TESTNET_CHAIN_ID = 300;
const MAINNET_CHAIN_ID = 324;

const mapAddresesToLowercase = (array: Array<Token>): Array<Token> => {
    return array.map((token) => {
        return { ...token, address: token.address.toLowerCase() };
    });
};

export const mainnetTokens: Array<Token> = mapAddresesToLowercase([
    {
        chainId: MAINNET_CHAIN_ID,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: '0x000000000000000000000000000000000000800a',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x000000000000000000000000000000000000800a.png',
        type: 'native',
    },
    {
        chainId: MAINNET_CHAIN_ID,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4.png',
        type: 'ERC20',
    },
    {
        chainId: MAINNET_CHAIN_ID,
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        address: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x493257fd37edb34451f62edf8d2a0c418852ba4c.png',
        type: 'ERC20',
    },
    {
        chainId: MAINNET_CHAIN_ID,
        name: 'Bridged USDC',
        symbol: 'USDC.e',
        decimals: 6,
        address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4.png',
        type: 'ERC20',
    },
    {
        chainId: MAINNET_CHAIN_ID,
        name: 'ZKsync',
        symbol: 'ZK',
        decimals: 18,
        address: '0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e.jpg',
        type: 'ERC20',
    },
]);

export const testnetTokens: Array<Token> = mapAddresesToLowercase([
    {
        chainId: TESTNET_CHAIN_ID,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        address: '0x000000000000000000000000000000000000800a',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x000000000000000000000000000000000000800a.png',
        type: 'native',
    },
    {
        chainId: TESTNET_CHAIN_ID,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0x235171e45abff2a15d117e3179df4cc35ebfae2f',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x235171e45abff2a15d117e3179df4cc35ebfae2f.png',
        type: 'ERC20',
    },
    {
        chainId: TESTNET_CHAIN_ID,
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        address: '0x7ee13f187cfa05c6396a5b6105a70bfdc6445a34',
        icon: 'https://clave-public-assets.s3.eu-central-1.amazonaws.com/tokens/0x7ee13f187cfa05c6396a5b6105a70bfdc6445a34.png',
        type: 'ERC20',
    },
]);

export const tokens =
    CONFIG.chainId === MAINNET_CHAIN_ID ? mainnetTokens : testnetTokens;
