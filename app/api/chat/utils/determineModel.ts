import {
  getUserId,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/api/actions/user';

export const LLM_MODELS = {
  'gpt-3': 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-4': 'gpt-4-1106-preview'
};

type Props = {
  overRideModel?: string;
};

export async function determineModel({ overRideModel }: Props) {
  const [products, subscription, uid] = await Promise.all([
    getActiveProductsWithPrices(),
    getSubscription(),
    getUserId()
  ]);

  const proProduct = products.find((product: any) => product.name === 'Pro');

  const proPrice = proProduct?.prices[0];

  const isProActive =
    subscription &&
    subscription.status === 'active' &&
    subscription.prices &&
    proPrice &&
    subscription.prices.id === proPrice.id;

  let model = LLM_MODELS['gpt-3.5-turbo'];
  if (overRideModel) {
    model = LLM_MODELS[overRideModel as keyof typeof LLM_MODELS];
  } else {
    if (isProActive) {
      model = LLM_MODELS['gpt-4'];
    }
  }

  return model;
}
