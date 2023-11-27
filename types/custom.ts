import { Database } from '@/types/supabase';

export type Message = Database['public']['Tables']['messages']['Row'];

export type ChatHistory = {
  created_at: string;
  id: string;
  messages: Message[];
  uid: string;
  updated_at: string;
};

export type ThreadWithMessages = {
  id: string;
  uid: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
};

export type Integration = {
  id: string;
  iconUrl: string;
  name: string;
  description: string;
  carbonKey: string | null;
  available: boolean;
};

export type UserBio = {
  id: string;
  bio: JSON;
  uid: string;
  updated_at: string;
  created_at: string;
};

export type SuggestedPrompt = {
  title: string;
  prompt: string;
};

export type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

export type Workspace = {
  id: string;
  name: string;
  type: string;
};

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export type Product = Database['public']['Tables']['products']['Row'];

export type Price = Database['public']['Tables']['prices']['Row'];
export interface ProductWithPrices extends Product {
  prices: Price[];
}

export interface PriceWithProduct extends Price {
  products: Product | null;
}
export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

export interface ExtendedDocument extends Document {
  pageContent: string;
}

export type OpenAIMessage = {
  role: string;
  content: string;
};
