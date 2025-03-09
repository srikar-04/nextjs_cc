'use server'
import { mistral } from '@ai-sdk/mistral'
import { streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';

export async function generate(input: string) {
  let fullText = '';

  const { textStream } = streamText({
    model: mistral('mistral-large-latest'),
    prompt: input,
    onError({ error }) {
      console.error(error, 'error inside onError function');
    },
  });

  for await (const delta of textStream) {
    fullText += delta;
  }

  return { output: fullText };
}

export async function POST() {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started? ||If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. ";

    const { output } = await generate(prompt);

    if (!output || output.trim() === '') {
      throw new Error('Generated text is empty');
    }

    // console.log('Generated output:', output);

    return Response.json({
      success: true,
      message: output.slice(1, -1)
    });
    
  } catch (error) {
    console.error('Error in suggest messages:', error);
    return Response.json({
      success: false,
      message: "Failed to generate messages",
    }, { status: 500 });
  }
}

/** 
 * const prompt = " Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started? ||If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. "
 */
