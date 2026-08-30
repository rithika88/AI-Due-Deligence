const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain due diligence in one simple sentence.",
    });

    console.log("===== GEMINI RESPONSE =====");
    console.log(response.text);
  } catch (error) {
    console.error("===== GEMINI ERROR =====");
    console.error(error.message);
  }
}

testGemini();
