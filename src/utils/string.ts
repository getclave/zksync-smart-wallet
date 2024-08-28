import { BigNumber, ethers } from 'ethers';

export const parseHex = (hex: string) => {
    return hex.startsWith('0x') ? hex.slice(2) : hex;
};

export const formatHex = (hex: string) => {
    return hex.startsWith('0x') ? hex : `0x${hex}`;
};

export const formatAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
};

export const formatAmount = (amount: string, decimals = 6) => {
    try {
        const split = amount.split('.');
        if (split.length === 2) {
            let decimal = extractFixedDecimal(split[1], decimals);
            decimal = decimal.length === 1 ? decimal + '0' : decimal;

            if (decimal.replace(/0/g, '').length === 0) {
                decimal = '00';
            }
            const parsedAmount = split[0] + '.' + decimal;
            return parsedAmount;
        }
        return amount;
    } catch {
        return amount;
    }
};

export const formatBigNumber = (
    amount: BigNumber,
    tokenDecimals: number,
    decimals = 6,
) => {
    const formatted = ethers.utils.formatUnits(amount, tokenDecimals);
    return formatAmount(formatted, decimals);
};

const extractFixedDecimal = (splitIndex: string, decimals: number): string => {
    const decimal = splitIndex.slice(0, decimals);
    return trimRightZeros(decimal);
};

const trimRightZeros = (value: string) => {
    return value.replace(/0+$/, '');
};
