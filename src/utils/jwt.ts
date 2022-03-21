export const parseJWT = (token: string): Record<string, string> => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
