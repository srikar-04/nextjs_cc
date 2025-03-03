import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST() {
  try {
    // Predefined prompt - customize this as needed
    const predefinedPrompt =
      "Generate 3 creative message templates for a marketing campaign about sustainable products."

    // System message to guide the model's behavior
    const systemMessage = "You are a helpful marketing assistant that creates engaging and concise message templates."

    // Generate the response using OpenAI's model
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: predefinedPrompt,
      system: systemMessage,
    })

    // Return the generated content
    return NextResponse.json({
      success: true,
      messages: text,
    })
  } catch (error) {
    console.error("Error generating messages:", error)
    return NextResponse.json({ success: false, error: "Failed to generate messages" }, { status: 500 })
  }
}





// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 90;

// export async function POST(req: Request) {
//     try {
    
//         const prompt = " Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started? ||If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. "

//         const result = await streamText({
//             model: openai('gpt-4o'),
//             prompt
//         });

//         const streamLineResponse = await result.toDataStreamResponse();
        
    
//         return await result.toDataStreamResponse();
//     } catch (error) {
//         console.error('an unexpected error occured while using ai',error);
//         throw error
//     }
// } 