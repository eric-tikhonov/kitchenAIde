import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

export async function recommendIngredients(ingredients, numRecommendations = 3) {
    const prompt = `Ingredients: ${ingredients}\nRecommended additional ingredients:`;
    const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2-medium',
        { inputs: prompt },
        {
            headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
            params: { max_new_tokens: 50, return_full_text: false, num_return_sequences: numRecommendations }
        }
    );
    const recommendedIngredients = response.data.map(res => res.generated_text.split('Recommended additional ingredients:')[1].trim());
    return recommendedIngredients;
}

export async function generateRecipes(ingredients, numRecipes = 3) {
    const prompt = `Ingredients: ${ingredients}\nRecipe Name:\n`;
    const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2-medium',
        { inputs: prompt },
        {
            headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
            params: { max_new_tokens: 300, return_full_text: false, num_return_sequences: numRecipes }
        }
    );
    const recipes = response.data.map(res => {
        const recipeText = res.generated_text;
        const recipeName = recipeText.split('Recipe Name:')[1].split('\n')[0].trim();
        const recipeSteps = recipeText.split('Recipe Name:')[1].split('\n').slice(1);
        const formattedRecipe = recipeSteps.map((step, index) => `${index + 1}. ${step.trim()}`).join('\n');
        return { recipeName, formattedRecipe };
    });
    return recipes;
}