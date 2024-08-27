export const parseHex = (hex: string) => {
  return hex.startsWith("0x") ? hex.slice(2) : hex;
};

export const formatHex = (hex: string) => {
  return hex.startsWith("0x") ? hex : `0x${hex}`;
};

export const formatAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};
