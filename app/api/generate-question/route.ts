import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Ensure OPENAI_API_KEY is set in your Vercel project's environment variables
// Or use a different provider and its corresponding API key
// e.g., ANTHROPIC_API_KEY for Anthropic models

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const topic = body.topic as string | undefined

    // Basic check for API key presence (the SDK will also check)
    // In a real application, you might have more sophisticated checks or fallbacks.
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn("No AI provider API key found in environment variables.")
      // For demonstration, returning a mock question if no API key is found.
      // In a production app, you should handle this more robustly,
      // perhaps by disabling the feature or informing the user.
      const mockQuestions = [
        "If you could have any superpower, what would it be and why? (Mock)",
        "What's a skill you'd like to learn this year? (Mock)",
        "What's your favorite way to unwind after a busy day? (Mock)",
      ]
      const randomMockQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)]
      return NextResponse.json({ question: topic ? `Mock question about ${topic}: What's new?` : randomMockQuestion })
    }

    let providerModel
    if (process.env.OPENAI_API_KEY) {
      providerModel = openai("gpt-4.1-nano")
    } else if (process.env.ANTHROPIC_API_KEY) {
      // Example: using Anthropic if OpenAI key is not present
      // import { anthropic } from '@ai-sdk/anthropic';
      // providerModel = anthropic('claude-3-haiku-20240307');
      // For this example, we'll stick to OpenAI as primary, but show the logic
      return NextResponse.json(
        { error: "OpenAI API key preferred for this example. Other providers need specific SDK setup." },
        { status: 500 },
      )
    } else {
      // Fallback or error if no suitable key is found
      return NextResponse.json({ error: "AI provider API key not configured." }, { status: 500 })
    }

    const prompt = `Generate a single, and concise "question of the day" for a team.
The question should be suitable for a work environment, and serves as a a bit of fun in daily meetings.
${topic ? `The question should be related to the topic: "${topic}".` : "The question can be on any general, engaging topic."}
Do not include any preamble, explanation, or quotation marks around the question itself. Just return the question text.
Ensure the question is relatively short and easy to understand. DO NOT be cringe. Do not make the question team related.`

    const { text } = await generateText({
      model: providerModel, // e.g., openai('gpt-3.5-turbo') or openai('gpt-4o')
      prompt: prompt,
      maxTokens: 60, // Keep questions concise
      temperature: 0.75, // A bit of creativity
    }) // [^2]

    return NextResponse.json({ question: text })
  } catch (error) {
    console.error("Error generating question:", error)
    let errorMessage = "Failed to generate question."
    if (error instanceof Error) {
      errorMessage = error.message
      // Check for specific AI SDK errors if needed
      if (errorMessage.includes("authentication") || errorMessage.includes("API key")) {
        errorMessage = "AI provider authentication failed. Please check your API key."
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
