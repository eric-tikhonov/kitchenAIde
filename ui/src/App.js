import React, { useState, useEffect, useCallback } from "react";
import { AddTaskInput } from "./components/AddTaskInput";
import { Task } from "./components/Task";
import Recipe from "./components/Recipe";
import axios from "axios";
import { API_URL } from "./utils";
import { PersistentDrawerLeft } from "./components/Drawer";
import Stack from "@mui/material/Stack";
import { Typography, Button, Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/task`);
      const sortedTasks = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTasks(sortedTasks);
      fetchRecipes(sortedTasks.map((task) => task.name)); // Use task names as ingredients
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchRecipes = async (ingredients) => {
    setRecommendations([]);
    setRecipes([]);

    try {
      const response = await axios.post(`${API_URL}/generate-recipes`, {
        ingredients,
      });
      setRecipes(response.data.recipes);

      const suggestedIngredientsArray = response.data.suggestedIngredients
        .split(",")
        .slice(0, 3)
        .map((ingredient) => ({
          id: `rec-${uuidv4()}`,
          name: ingredient.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        }));
      setRecommendations(suggestedIngredientsArray);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const removeRecommendation = (id) => {
    setRecommendations((prevRecommendations) =>
      prevRecommendations.filter((rec) => rec.id !== id)
    );
  };

  const editTaskListOnUpdate = useCallback((updatedTask, deleted = false) => {
    setTasks((prevTasks) => {
      if (deleted) {
        return prevTasks.filter((task) => task.id !== updatedTask.id);
      }
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return updatedTasks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <PersistentDrawerLeft lists={["List"]} />
      <AddTaskInput fetchTasks={fetchTasks} />
      <Stack className="listItems">
        {tasks.map((task) => (
          <Task
            task={task}
            key={task.id}
            editTaskListOnUpdate={editTaskListOnUpdate}
            fetchTasks={fetchTasks}
          />
        ))}
      </Stack>
      <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchRecipes(tasks.map((task) => task.name))}
          disabled={!recommendations.length}
        >
          Regenerate AI Results
        </Button>
      </Box>
      <Typography variant="h5" sx={{ mt: 0, mb: 2 }}>
        {recommendations.length
          ? "Suggested Ingredients"
          : "Loading AI Results..."}
      </Typography>
      <Stack className="listItems">
        {recommendations.map((rec) => (
          <Task
            task={rec}
            key={rec.id}
            editTaskListOnUpdate={editTaskListOnUpdate}
            fetchTasks={fetchTasks}
            isRecommendation
            removeRecommendation={removeRecommendation}
          />
        ))}
      </Stack>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {recipes.length ? "Suggested Recipes" : "Loading AI Results..."}
      </Typography>
      <Stack className="recipeTitles">
        {recipes.map((recipe) => (
          <Recipe recipe={recipe} key={recipe.id} />
        ))}
      </Stack>
    </div>
  );
}
