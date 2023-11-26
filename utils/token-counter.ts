import { encode } from 'gpt-tokenizer';

const MAX_TOKEN_COUNT = 10000;

export const isWithinTokenLimit = async ({ text }: { text: string }) => {
  // Encode text into tokens
  const tokens = encode(text);

  if (tokens.length <= MAX_TOKEN_COUNT) {
    return true;
  } else {
    return false;
  }
};
