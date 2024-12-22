import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { fetchTasks, createTasks, updateTasks, deleteTasks } from "./task.js";
import { recommendIngredients, generateRecipes } from "./recipeGenerator.js";
import dotenv from "dotenv";

dotenv.config();

console.log("Starting server...");

const app = express();
const port = 3001;

app.use(express.json());

if (process.env.DEVELOPMENT === 'true') {
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
    const { ingredients } = req.body;
    
    const suggestedIngredients = await recommendIngredients(ingredients);
    const recipes = await generateRecipes(ingredients);
    
    res.json({ recipes, suggestedIngredients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

if (process.env.DEVELOPMENT === 'true') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
} else {
  console.log("Running in serverless mode");
}

export const handler = serverless(app);

console.log("Server setup complete.");