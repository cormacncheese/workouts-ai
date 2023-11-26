import { OpenAIModerationChain } from 'langchain/chains';

import { tracer } from '../chat/utils/langSmithClient';

export async function moderateQuery(query: string) {
  try {
    // Create a new instance of the OpenAIModerationChain
    const moderation = new OpenAIModerationChain({
      throwError: true // If set to true, the call will throw an error when the moderation chain detects violating content. If set to false, violating content will return "Text was found that violates OpenAI's content policy.".
    });

    // Send the user's input to the moderation chain and wait for the result
    const { output: badResult, results } = await moderation.call(
      {
        input: query
      },
      { callbacks: [tracer] }
    );

    // You can view the category scores of each category. This is useful when dealing with non-english languages, as it allows you to have a more granular control over moderation.
    if (results[0].flagged) {
      throw new Error('Harmful content detected!');
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
