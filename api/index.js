import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { fetchTasks, createTasks, updateTasks, deleteTasks } from "./task.js";
import { recommendIngredients, generateRecipes } from "./recipeGenerator.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/task", async (req, res) => {
  try {
    const tasks = await fetchTasks();
    res.send(tasks.Items);
  } catch (err) {
    res.status(400).send(`Error fetching tasks: ${err}`);
  }
});

app.post("/task", async (req, res) => {
  try {
    const task = req.body;

    if (!task.createdAt) {
      task.createdAt = new Date().toISOString();
    }

    const response = await createTasks(task);
    res.send(response);
  } catch (err) {
    res.status(400).send(`Error creating tasks: ${err}`);
  }
});

app.put("/task", async (req, res) => {
  try {
    const task = req.body;
    const response = await updateTasks(task);
    res.send(response);
  } catch (err) {
    res.status(400).send(`Error updating tasks: ${err}`);
  }
});

app.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteTasks(id);
    res.send(response);
  } catch (err) {
    res.status(400).send(`Error deleting tasks: ${err}`);
  }
});

app.post("/generate-recipes", async (req, res) => {
  try {
    const { ingredients, numRecommendations = 3, numRecipes = 3 } = req.body;
    
    // Generate additional ingredient recommendations
    const additionalIngredientsList = await recommendIngredients(ingredients, numRecommendations);
    
    // Combine the original and additional ingredients for each recommendation
    const allIngredientsList = additionalIngredientsList.map(additionalIngredients => `${ingredients}, ${additionalIngredients}`);
    
    // Generate multiple recipes based on the combined ingredients
    const recipes = [];
    for (const allIngredients of allIngredientsList) {
      const generatedRecipes = await generateRecipes(allIngredients, numRecipes);
      recipes.push(...generatedRecipes);
    }
    
    res.json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

if (process.env.DEVELOPMENT) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);