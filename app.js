import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Make sure your API key is stored in the .env file
});

async function listModels() {
    try {
        const response = await openai.models.list(); // List all available models
        console.log(response.data); // Log model information
    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

listModels();
