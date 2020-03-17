import * as bcrypt from 'bcrypt';

const _saltRounds = 11;

export const GenerateHash = async function(data: string): Promise<string> {
  return await bcrypt.hash(data, _saltRounds);
};

export const CompareHash = async (
  data: string,
  hashedData: string,
): Promise<boolean> => {
  return await bcrypt.compare(data, hashedData);
};
