export const parseHex = (hex: string) => {
  return hex.startsWith("0x") ? hex.slice(2) : hex;
};

export const formatHex = (hex: string) => {
  return hex.startsWith("0x") ? hex : `0x${hex}`;
};
