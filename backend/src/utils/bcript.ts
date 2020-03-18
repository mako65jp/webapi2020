import * as bcrypt from 'bcrypt';

const _saltRounds = 11;

export const generateHash = async function(data: string): Promise<string> {
  return await bcrypt.hash(data, _saltRounds);
};

export const compareHash = async (
  data: string,
  hashedData: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(data, hashedData);
  } catch (e) {
    return false;
  }
};
