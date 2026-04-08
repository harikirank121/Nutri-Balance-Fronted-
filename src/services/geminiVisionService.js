import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeMealPhoto = async (imageFile) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Helper to convert the File to the format required by the API
        const fileToGenerativePart = async (file) => {
            const base64EncodedDataPromise = new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(file);
            });
            return {
                inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
            };
        };

        const imagePart = await fileToGenerativePart(imageFile);

        const prompt = `Analyze this meal photo. Identify the food items and estimate their nutritional content.
IMPORTANT: You must return the result strictly as a raw JSON object string ONLY, with NO markdown formatting, NO backticks, and NO code blocks around it. Use exactly this schema:
{
    "items": [
        {
            "name": "Food item name",
            "calories": 200,
            "protein": 15,
            "qty": 1,
            "totalCals": 200
        }
    ],
    "totalCalories": 400,
    "message": "A brief encouraging message about the nutritional quality of the meal"
}`;

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        // Sometimes the AI might still wrap in markdown despite instructions, so we clean it up
        let jsonStr = responseText.trim();
        if (jsonStr.startsWith('\`\`\`json')) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        } else if (jsonStr.startsWith('\`\`\`')) {
            jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
        }

        const data = JSON.parse(jsonStr);

        // Ensure items have necessary values like unique IDs for React rendering
        const itemsWithIds = data.items.map((item, index) => ({
            ...item,
            id: Date.now() + index,
            qty: item.qty || 1,
            totalCals: item.totalCals || item.calories || 0,
            protein: item.protein || 0
        }));

        return {
            success: true,
            items: itemsWithIds,
            totalCalories: data.totalCalories || itemsWithIds.reduce((sum, item) => sum + item.totalCals, 0),
            message: data.message || "Meal analyzed successfully!",
            confidence: 0.95 // Mocked confidence
        };
    } catch (error) {
        console.error("Gemini Vision API Error:", error);
        return {
            success: false,
            message: "Failed to analyze the photo with Gemini AI. Please try again."
        };
    }
};
