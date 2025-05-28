import axios from "axios";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const recipeService = {
  /**
   * Fetches recipe suggestions from Gemini AI based on a list of ingredients.
   * @param {string[]} ingredients - An array of ingredient names.
   * @returns {Promise<Array<Object>>} - A promise that resolves to an array of recipe objects.
   */
  getRecipes: async (ingredients) => {
    if (!ingredients || ingredients.length === 0) {
      return [];
    }

    const prompt = `
You are a creative culinary assistant. Based on the following list of expiring food items, please suggest 1 to 3 simple and quick recipes.
Prioritize using the provided ingredients. You can include common pantry staples (like salt, pepper, oil, basic spices) if necessary.

Expiring ingredients:
${ingredients.join(', ')}

For each recipe, provide the following information in a JSON format:
- name: A catchy name for the recipe.
- description: A brief, appealing description of the dish.
- ingredientsUsed: An array of strings listing the main ingredients from the provided list that are used in this recipe.
- additionalIngredients: An array of strings for any common pantry staples needed (e.g., "salt", "pepper", "olive oil").
- instructions: A string containing concise, step-by-step cooking instructions. Ensure instructions are formatted with newlines for readability.

Return a single JSON object with a key "recipes" which is an array of these recipe objects.
Example:
{
  "recipes": [
    {
      "name": "Quick Veggie Scramble",
      "description": "A fast and nutritious egg scramble perfect for using up leftover vegetables.",
      "ingredientsUsed": ["Eggs", "Spinach", "Tomatoes"],
      "additionalIngredients": ["Salt", "Pepper", "Olive oil"],
      "instructions": "1. Whisk eggs with salt and pepper.\\n2. Sauté spinach and tomatoes in olive oil.\\n3. Pour in eggs and cook until set. Serve immediately."
    }
  ]
}

If no suitable recipes can be generated from the given ingredients, or if the list is too small, return an empty array for "recipes":
{
  "recipes": []
}
`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.5, // Allow for some creativity
      }
    };

    try {
      const response = await axios.post(GEMINI_API_ENDPOINT, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const responseData = response.data;
      if (responseData && responseData.candidates && responseData.candidates[0]?.content?.parts) {
        const responseText = responseData.candidates[0].content.parts[0].text;
        console.log("Gemini raw recipe response:", responseText);
        try {
          // Extract JSON part from the response text
          const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
          if (jsonMatch) {
            const jsonString = jsonMatch[1] || jsonMatch[2];
            const jsonData = JSON.parse(jsonString);
            return jsonData.recipes || [];
          } else {
            console.warn("No JSON block found in Gemini recipe response.");
            return [];
          }
        } catch (parseError) {
          console.error("Error parsing Gemini JSON recipe response:", parseError, "Raw text:", responseText);
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching recipes from Gemini AI:", error.response ? error.response.data : error.message);
      return [];
    }
  }
};

export default recipeService;