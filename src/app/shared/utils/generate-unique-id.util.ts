const generateRandomCode = () => {
  return Math.random().toString(36).slice(2, 11);
};

export const generateUniqueId = () => {
  return generateRandomCode().concat(generateRandomCode(), generateRandomCode());
};
