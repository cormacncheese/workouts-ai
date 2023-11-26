import axios from 'axios';

export const tokenFetcher = async (uid: string) => {
  let data = null;
  try {
    const response = await axios.get('/api/auth/fetchCarbonTokens', {
      params: { customer_id: uid }
    });
    data = response.data;
  } catch (error) {
    console.log('error: ', error);
  }
  return data;
};
