import * as bcrypt from 'bcrypt';

const _saltRounds = 11;

export const GeneratePasswordHash = async function(
  password: string,
): Promise<string> {
  return await bcrypt.hash(password, _saltRounds);
};

export const CorrectPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => await bcrypt.compare(password, hashedPassword);
