import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from 'dotenv';

dotenv.config();

const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

export async function recommendIngredients(ingredients) {
    const prompt = `Here's my Ingredients: ${ingredients}\nRecommend me additional ingredients. Respond with only a comma-separated list\n`;
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 50,
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ],
    };

    const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: 'anthropic.claude-v2',
    });

    const response = await bedrockClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);

    console.log('Response Body:', responseBody);

    if (responseBody.content && responseBody.content[0] && responseBody.content[0].text) {
        return responseBody.content[0].text;
    } else {
        throw new Error('Unexpected response structure');
    }
}

export async function generateRecipes(ingredients) {
    const exampleInput = {
        "ingredients": [
            "pepper",
            "salt",
            "olive oil",
            "tomato",
            "chicken",
            "garlic",
            "onion"
        ]
    };

    const exampleOutput = {
        "recipes": [
            {
                "name": "Grilled Chicken with Tomato and Onion",
                "formattedRecipe": "1. 2 chicken breasts\n2. 1 tomato, chopped\n3. 1 onion, sliced\n4. 2 cloves garlic, minced\n5. 2 tbsp olive oil\n6. Salt and pepper to taste\n7. Grill the chicken and top with tomato, onion, and garlic mixture."
            },
            {
                "name": "Chicken Stir-Fry",
                "formattedRecipe": "1. 2 chicken breasts, sliced\n2. 1 onion, chopped\n3. 1 bell pepper, sliced\n4. 2 cloves garlic, minced\n5. 2 tbsp olive oil\n6. Salt and pepper to taste\n7. Stir-fry all ingredients until cooked through."
            }
        ],
        "additionalSuggestedIngredientsList": [
            [
                "Bell Pepper",
                "Soy Sauce",
                "Rice",
                "Green Beans"
            ]
        ]
    };

    const prompt = `Respond only with JSON. Here is a sample list of ingredients: ${JSON.stringify(exampleInput, null, 2)}\nExample output should look like: ${JSON.stringify(exampleOutput, null, 2)}\nNow give me an output from this list of Ingredients: ${ingredients}\n`;

    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 300,
        messages: [
            {
                role: "user",
                content: [{ type: "text", text: prompt }],
            },
        ],
    };

    const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: 'anthropic.claude-v2',
    });

    const response = await bedrockClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decodedResponseBody);

    console.log('Response Body:', responseBody);

    if (responseBody.content && responseBody.content[0] && responseBody.content[0].text) {
        const jsonResponse = responseBody.content[0].text;
        try {
            const parsedResponse = JSON.parse(jsonResponse);
            return parsedResponse.recipes;
        } catch (error) {
            throw new Error('Failed to parse JSON response');
        }
    } else {
        throw new Error('Unexpected response structure');
    }
}