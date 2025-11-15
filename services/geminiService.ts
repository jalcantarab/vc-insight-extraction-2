import { GoogleGenAI, Type } from "@google/genai";
import { InsightItem, Relation, ItemType } from '../types';

interface ProcessedTranscript {
    items: InsightItem[];
    relations: Relation[];
}

const API_KEY = process.env.API_KEY;

// Initialize with the API key from environment variables.
// The `processTranscript` function will handle cases where the key is missing.
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        items: {
            type: Type.ARRAY,
            description: "An array of extracted items from the transcript.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: 'A unique identifier for the item, e.g., "idea-1"' },
                    type: { type: Type.STRING, enum: Object.values(ItemType), description: 'The type of the item: Signal, Insight, Opportunity, or Idea.' },
                    title: { type: Type.STRING, description: 'A concise, descriptive title for the item (5-10 words).' },
                    description: { type: Type.STRING, description: 'A detailed one-sentence description of the item.' },
                    confidence: { type: Type.NUMBER, description: 'A confidence score from 0.0 to 1.0 on the accuracy of the extraction.' },
                    sourceSnippet: { type: Type.STRING, description: 'The exact quote or short, relevant snippet from the transcript this item is derived from.' }
                },
                required: ['id', 'type', 'title', 'description', 'confidence', 'sourceSnippet']
            }
        },
        relations: {
            type: Type.ARRAY,
            description: "An array of relationships between the extracted items, showing how they connect.",
            items: {
                type: Type.OBJECT,
                properties: {
                    sourceId: { type: Type.STRING, description: 'The ID of the source item in the relationship (e.g., a Signal leading to an Insight).' },
                    targetId: { type: Type.STRING, description: 'The ID of the target item in the relationship (e.g., the Insight derived from a Signal).' }
                },
                required: ['sourceId', 'targetId']
            }
        }
    },
    required: ['items', 'relations']
};

const systemInstruction = `You are an expert Product Manager assistant. Your purpose is to analyze conversation transcripts and extract a structured hierarchy of Signals, Insights, Opportunities, and Ideas, along with their relationships. You must adhere strictly to the provided JSON schema for your output.

Definitions:
- Signal: A direct observation or quote from the user. A piece of raw data.
- Insight: An interpretation of one or more signals. The "why" behind the data.
- Opportunity: A potential area for improvement or a problem to be solved, derived from an insight.
- Idea: A concrete, actionable solution to address an opportunity.

Instructions:
1.  Read the entire transcript carefully.
2.  Identify distinct Signals, Insights, Opportunities, and Ideas.
3.  For each item, provide a unique ID (e.g., 'signal-1', 'insight-1'), a title, a description, a confidence score, and the source snippet from the transcript.
4.  Establish relationships between items. A Signal should lead to an Insight, an Insight to an Opportunity, and an Opportunity to one or more Ideas.
5.  Return the output in the specified JSON format. Ensure all IDs in the relations array correspond to IDs in the items array.`;


const createUserPrompt = (transcript: string): string => `
    Please analyze the following transcript and generate the structured output.

    Transcript:
    ---
    ${transcript}
    ---
`;

export const processTranscript = async (transcript: string): Promise<ProcessedTranscript | null> => {
    if (!API_KEY) {
        console.error("Gemini API key is not configured. Please set the API_KEY environment variable.");
        throw new Error("Gemini API key is not configured.");
    }
    
    const prompt = createUserPrompt(transcript);
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        
        // Add default tags and accepted properties to each item
        const itemsWithDefaults = parsedJson.items.map((item: Omit<InsightItem, 'tags' | 'accepted'>) => ({
            ...item,
            tags: [],
            accepted: null, // Initially undecided
        }));

        return {
            items: itemsWithDefaults,
            relations: parsedJson.relations,
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI model. Please check your transcript or try again.");
    }
};
