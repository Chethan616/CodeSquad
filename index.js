import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Load API key from environment variable
});

async function getAIResponse() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Ensure valid model name
            messages: [
                { role: "user", content: "write a haiku about AI" }
            ]
        });

        console.log(completion.choices[0].message.content); // Log the response
    } catch (error) {
        console.error('Error:', error);
    }
}

getAIResponse();
