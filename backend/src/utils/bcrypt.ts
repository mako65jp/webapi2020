import * as bcrypt from 'bcrypt';

const _saltRounds = 11;

export const generateHash = (plainString: string): string => {
  return bcrypt.hashSync(plainString, _saltRounds);
};

export const compareHash = (
  plainString: string,
  hashedString: string,
): boolean => {
  console.log(plainString + ' -> ' + hashedString);
  try {
    return bcrypt.compareSync(plainString, hashedString);
  } catch {
    return false;
  }
};
