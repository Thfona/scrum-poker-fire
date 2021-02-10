const generateCode = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateUniqueIdUtil = () => {
  return generateCode().concat(generateCode(), generateCode());
};
