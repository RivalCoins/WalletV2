export default (text: string, size: number) =>
  `${text.slice(0, size)}...${text.slice(-size)}`;
