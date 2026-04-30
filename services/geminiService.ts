
import { GoogleGenAI, Type } from "@google/genai";
import { BillAnalysis, HistoricalDataItem } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const billAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        period: { type: Type.STRING, description: "The billing period, e.g., 'Jan 1 - Jan 31, 2024'." },
        total_kwh: { type: Type.NUMBER, description: "Total kilowatt-hours consumed." },
        total_cost: { type: Type.NUMBER, description: "Total cost of the bill in its currency." },
        cost_per_kwh: { type: Type.NUMBER, description: "Calculated cost per kWh." },
        daily_usage: { type: Type.NUMBER, description: "Average daily kWh usage." },
        bill_days: { type: Type.INTEGER, description: "Number of days in the billing period." },
        comparison_to_average: { type: Type.STRING, description: "A brief comparison to the user's average usage." },
      },
      required: ["period", "total_kwh", "total_cost", "cost_per_kwh", "daily_usage", "bill_days", "comparison_to_average"],
    },
    trend_analysis: {
      type: Type.OBJECT,
      properties: {
        trend: { type: Type.STRING, description: "Overall consumption trend (e.g., 'increasing', 'decreasing', 'stable')." },
        change_percentage: { type: Type.NUMBER, description: "Percentage change from the previous period or average." },
        seasonal_pattern: { type: Type.STRING, description: "Detected seasonal patterns, e.g., 'higher summer usage'." },
        anomalies: { type: Type.STRING, description: "Any detected anomalies or 'none detected'." },
      },
      required: ["trend", "change_percentage", "seasonal_pattern", "anomalies"],
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Category of the suggestion (e.g., 'Heating/Cooling', 'Appliances')." },
          suggestion: { type: Type.STRING, description: "The specific, actionable suggestion." },
          potential_savings: { type: Type.STRING, description: "Estimated potential savings in kWh and currency." },
          priority: { type: Type.STRING, description: "Priority of the suggestion ('high', 'medium', 'low')." },
          implementation_ease: { type: Type.STRING, description: "How easy the suggestion is to implement (e.g., 'easy', 'moderate')." },
        },
        required: ["category", "suggestion", "potential_savings", "priority", "implementation_ease"],
      },
    },
    summary: { type: Type.STRING, description: "A concise summary of the key findings." },
    historical_context: { type: Type.STRING, description: "A statement providing context based on historical data." },
  },
  required: ["analysis", "trend_analysis", "suggestions", "summary", "historical_context"],
};

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeBill = async (
  image: { base64: string; mimeType: string },
  historicalData: HistoricalDataItem[]
): Promise<BillAnalysis> => {
  const imagePart = fileToGenerativePart(image.base64, image.mimeType);
  const historicalDataString = historicalData.length > 0 ? JSON.stringify(historicalData) : "No historical data available.";

  const prompt = `
    
    Analyze this electricity bill image. Your goal is to act as EcoWatts AI, an expert in energy consumption analysis for an Indian user.

    IMPORTANT:
    - All currency values MUST be in Indian Rupees (₹), not dollars.
    - Assume the bill is from India.
    - Format all monetary values using ₹ symbol.

    Extract key metrics as defined in the schema.
    
    If historical data is provided, compare the current bill with it to identify trends, patterns, and anomalies. Use phrases like:
    - "Compared to your [timeframe] average of [number] kWh..."
    - "This represents a [percentage] change from your previous bill..."
    - "Your usage pattern shows [trend description]..."
    
    Generate specific, actionable suggestions based on the user's actual usage history. Categorize them, estimate potential savings in ₹, prioritize them, and note their implementation ease.
    
    Provide a concise summary and a historical context statement.
    
    Handle potential issues gracefully:
    - If the image is unclear, note which values you are uncertain about in the summary.
    - If no historical data is provided, state that in the summary and historical_context.
    - If you detect an unusual spike, mention it in the anomalies section.

    Always return a valid JSON object matching the provided schema. Do not include markdown formatting.

    Here is the historical data for this user:
    ${historicalDataString}
`;

  const textPart = { text: prompt };

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: billAnalysisSchema,
    },
  });

  try {
    const jsonString = result.text.trim();
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as BillAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", result.text);
    throw new Error("The AI response was not in the expected format. Please try again.");
  }
};
