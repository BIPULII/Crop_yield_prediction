import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PredictionInput {
  year: number;
  rainfall: number;
  pesticides: number;
  avgTemp: number;
  area: string;
  item: string;
}

export interface PredictionResult {
  prediction: number;
  reasoning: string;
  confidence: number;
  modelType?: string;
  error?: string;
}

export async function predictCropYield(input: PredictionInput) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert agricultural data scientist. Based on the following historical data patterns:
    - Data includes Year (1985-2016), Annual Rainfall (mm), Pesticide Use (tonnes), Avg Temperature (C), Area (Country), and Item (Crop).
    - Target: Production (hg/ha).
    - Example: Afghanistan, Maize, 1985, 327mm rainfall, 25869 tonnes pesticide, 26.3C temp -> 16652 hg/ha.
    - Trends: Higher rainfall and pesticide use generally correlate with higher yield, but temperature has optimal ranges.
    
    Predict the 'Production' (hg/ha) for the following input:
    Year: ${input.year}
    Area: ${input.area}
    Item: ${input.item}
    Annual Rainfall: ${input.rainfall} mm
    Pesticide Use: ${input.pesticides} tonnes
    Avg Temperature: ${input.avgTemp} °C
    
    Provide a realistic numerical prediction and a brief reasoning (max 2 sentences).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prediction: { type: Type.NUMBER, description: "Predicted production in hg/ha" },
          reasoning: { type: Type.STRING, description: "Brief explanation for the prediction" },
          confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" }
        },
        required: ["prediction", "reasoning", "confidence"]
      }
    }
  });

  return JSON.parse(response.text);
}

/**
 * Predict crop yield using the trained Random Forest model from Colab
 * Requires the backend server to be running and model.pkl to be available
 */
export async function predictCropYieldWithTrainedModel(input: PredictionInput): Promise<PredictionResult> {
  try {
    const response = await fetch('http://localhost:3001/api/predict-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year: input.year,
        rainfall: input.rainfall,
        pesticides: input.pesticides,
        avgTemp: input.avgTemp,
        area: input.area,
        item: input.item
      })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling trained model:', error);
    throw new Error(
      'Unable to connect to trained model server. Make sure:\n' +
      '1. Backend server is running (npm run server)\n' +
      '2. model.pkl is in the project root directory\n' +
      '3. Python with scikit-learn is installed'
    );
  }
}

/**
 * Check if the trained model is available
 */
export async function checkModelStatus(): Promise<{ modelReady: boolean; message: string }> {
  try {
    const response = await fetch('http://localhost:3001/api/model-status');
    return await response.json();
  } catch (error) {
    return {
      modelReady: false,
      message: 'Backend server not running'
    };
  }
}
