import { tracer } from '@/app/api/chat/utils/langSmithClient';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { learnUser } from '@/app/api/chat/utils/learnUser';
import SimilaritySearchWebsite from '@/app/api/chat/utils/searchWebsite';
import { getModel } from '@/app/api/chat/utils/model';
import { metaPrompt } from '@/utils/meta-prompt';
import SimilaritySearchChatHistory from '@/app/api/chat/utils/carbon/searchChatHistory';
import GetRecentChatHistory from '@/app/api/chat/utils/getRecentChatHistory';
import { searchCarbon } from '@/app/api/chat/utils/carbon/searchCarbon';
import { searchCarbonFiles } from '../carbon/searchCarbonFiles';
import { searchCarbonLinks } from '../carbon/searchCarbonLinks';
import SimilaritySearchText from '@/app/api/chat/utils/searchText';
import getLearnedContext from '@/app/api/chat/utils/getLearnedContext';
import searchGoogle from '@/app/api/chat/utils/serpSearch';
import searchSavedEmbeddings from '@/app/api/chat/utils/searchSavedEmbeddings';

type Props = {
  query: string;
  user_data: any;
  business_data: any;
  history: any[];
  businessId?: string;
  workspace?: {
    id: string;
    type: string;
  };
  file_id?: string;
  link_id?: string;
  is_live_search?: boolean;
  handlers: any;
};

export default async function makeMessageChain({
  query,
  user_data,
  business_data,
  history,
  businessId,
  workspace,
  file_id,
  link_id,
  is_live_search,
  handlers
}: Props) {
  let prompt;

  const model = await getModel({});

  const name = user_data.full_name;
  const uid = user_data.uid;
  const userBio = user_data?.bio;
  const userInstructions = user_data?.instructions || '';

  // Build context data
  let todo;
  let bio;
  let brand_voice;
  let seo_keywords;
  let target_customer;
  let business_summary;
  let business_name;
  let contextData = '';
  if (workspace?.type === 'business') {
    todo = business_data.todo;
    bio = business_data.bio;
    business_name = business_data.name;
    brand_voice = bio?.brand_voice;
    seo_keywords = bio?.seo_keywords;
    target_customer = bio?.target_customer;
    business_summary = bio?.business_summary;

    contextData = `
        Business summary: ${business_summary || ''}
        Target customer: ${target_customer || ''}
        SEO keywords: ${seo_keywords || ''}
        Brand voice: ${brand_voice || ''}
        Business name: ${business_name || ''}
        Business todo list: ${JSON.stringify(todo) || ''}
    `;
  } else {
    // attach user data
    todo = user_data.todo;
    bio = user_data.bio;

    contextData = `
        Learned user info: ${bio?.ai_learned || ''},
        User todo list: ${JSON.stringify(todo)},
        Goals: ${bio?.goals || ''},
        Hobbies: ${bio?.hobbies || ''},
        Working on: ${bio?.working_on || ''},
        Writing style: ${bio?.writing_style || ''},
    `;
  }

  console.log('before promises');

  // get website, interation and learned information
  const [
    relevantChatHistory,
    recentChatHistory,
    relevantData,
    relevantWebsiteInfo,
    carbonData,
    carbonFiles,
    carbonLinks,
    liveSearchContext,
    aiLearnedContext,
    savedContext
  ] = await Promise.all([
    SimilaritySearchChatHistory({ query, history }),
    GetRecentChatHistory({ history }),
    SimilaritySearchText({
      query,
      text: contextData,
      k: 4
    }),
    SimilaritySearchWebsite({
      query,
      uid,
      businessId: workspace?.type === 'business' ? businessId : undefined
    }),
    searchCarbon({
      query,
      customer_id: workspace?.id || uid,
      k: 4
    }),
    searchCarbonFiles({
      query,
      customer_id: workspace?.id || uid,
      file_ids: file_id ? [file_id] : [],
      k: 3
    }),
    searchCarbonLinks({
      query,
      customer_id: workspace?.id || uid,
      link_ids: link_id ? [link_id] : [],
      k: 3
    }),
    searchGoogle({ query, is_live_search }),
    getLearnedContext({
      query,
      uid,
      businessId: workspace?.type === 'business' ? businessId : undefined
    }),
    searchSavedEmbeddings({
      query,
      uid,
      businessId: workspace?.type === 'business' ? businessId : undefined
    })
  ]);

  console.log('savedContext: ', savedContext);

  console.log('after promises');

  const stringifiedHistory = JSON.stringify(recentChatHistory);

  // Query LLM

  if (workspace?.type === 'business') {
    prompt = PromptTemplate.fromTemplate(
      `You are my helpful business personal assistant. Your role is to be my best assistant and help me with whatever I need. You are an expert in whatever I need help with.

        I have conversations with you, here is my next message: {query}.
        
        This is part of a conversation. Use the most recent chat between us: {chat_history} and relevant chat history: {relevant_chat_history} to reply in natural way.
                
        Website info: {relevant_website}.

        Previously learned information about the user: {ai_learned}. 

        My notes from Notion and Google Drive: {integration_data}.

        My files: {file_data}.
        
        Other relevant data: {relevant_data}.

        Relevant saved messages from me: {saved_context}.

        Live search context, most up to date: {live_search_context}.

        My link and website data: {link_data}.

        If any of the data is empty, ignore it.
        
        My name: {user_name}. Only use my name when applicable, not every message. 
        
        Custom instructions from me: {user_instructions}. If there are no instructions, ignore it.

        {metaPrompt}.
    `
    );

    const chain = new LLMChain({ llm: model, prompt: prompt });

    chain.call(
      {
        query: query,
        chat_history: stringifiedHistory,
        relevant_chat_history: relevantChatHistory,
        user_name: name,
        metaPrompt: metaPrompt,
        user_instructions: userInstructions || '',
        relevant_data: relevantData,
        relevant_website: relevantWebsiteInfo,
        ai_learned: aiLearnedContext,
        integration_data: carbonData,
        file_data: carbonFiles,
        link_data: carbonLinks,
        live_search_context: liveSearchContext,
        saved_context: savedContext
      },
      { callbacks: [tracer, handlers] }
    );
  } else {
    prompt = PromptTemplate.fromTemplate(
      `You are my helpful personal assistant. Your role is to be my best assistant and help me with whatever I need. You are an expert in whatever I need help with.

        I have conversations with you, here is my next message: {query}.
        
        This is part of a conversation. Use the most recent chat between us: {chat_history} and relevant chat history: {relevant_chat_history} to reply in natural way.
                        
        My name: {user_name}. Only greet me with my name when applicable, do not use it every message.
                
        Website info: {relevant_website}.

        Previously learned information about the user: {ai_learned}. 

        My notes from Notion and Google Drive: {integration_data}. 

        My files: {file_data}.

        Relevant saved messages from me: {saved_context}.
        
        Other relevant data: {relevant_data}.
        
        Live search context, most up to date: {live_search_context}.

        My link and website data: {link_data}.
        
        Custom instructions from me: {user_instructions}.
        
        If any of the data is empty, ignore it.

        {metaPrompt}
    `
    );

    const chain = new LLMChain({ llm: model, prompt: prompt });

    chain.call(
      {
        query: query,
        chat_history: stringifiedHistory,
        relevant_chat_history: relevantChatHistory,
        user_name: name,
        metaPrompt: metaPrompt,
        user_instructions: userInstructions || '',
        relevant_data: relevantData,
        relevant_website: relevantWebsiteInfo,
        ai_learned: aiLearnedContext,
        integration_data: carbonData,
        file_data: carbonFiles,
        link_data: carbonLinks,
        live_search_context: liveSearchContext,
        saved_context: savedContext
      },
      { callbacks: [tracer, handlers] }
    );
  }

  // Learn about the user for future conversations
  learnUser({
    query,
    messageHistory: stringifiedHistory,
    userBio,
    uid,
    businessId: workspace?.type === 'business' ? businessId : undefined
  });
}
