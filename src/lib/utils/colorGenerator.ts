export const generateRandomColor = (): string => {
  const hue = Math.random() * 360;
  const saturation = 70 + Math.random() * 10; // 70-80%
  const lightness = 45 + Math.random() * 10; // 45-55%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getDarkerShade = (color: string): string => {
  const hsl = color.match(/\d+/g).map(Number);
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${Math.max(hsl[2] - 20, 0)}%)`;
};