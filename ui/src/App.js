import React, { useState, useEffect, useCallback } from "react";
import { AddTaskInput } from "./components/AddTaskInput";
import { Task } from "./components/Task";
import Recipe from './components/Recipe';
import RecipeModal from './components/RecipeModal';
import axios from "axios";
import { API_URL } from "./utils";
import { PersistentDrawerLeft } from "./components/Drawer";
import Stack from "@mui/material/Stack";
import { Typography } from '@mui/material';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([/*
    { id: 'rec1', name: 'Milk', completed: false, createdAt: new Date().toISOString() },
    { id: 'rec2', name: 'Eggs', completed: false, createdAt: new Date().toISOString() },
  */]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(API_URL);
      const sortedTasks = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(sortedTasks);
      fetchRecommendations(sortedTasks);
      //fetchRecipes();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchRecommendations = async (tasks) => {
    try {
      //const { data } = await axios.post(`${API_URL}/recommendations`, { tasks });
      //setRecommendations(data);

      const filteredRecommendations = recommendations.filter(
        (rec) => !tasks.some((task) => task.name.includes(rec.name))
      );
      setRecommendations(filteredRecommendations);
    } catch (err) {
      console.log(err);
    }
  };

  const removeRecommendation = (id) => {
    setRecommendations((prevRecommendations) =>
      prevRecommendations.filter((rec) => rec.id !== id)
    );
  };

  const fetchRecipes = async (ingredients) => {
    try {
      /*
      const hardCodedRecipes = [
        { id: 'recipe1', title: 'French Toast', steps: 'Beat 2 eggs with 1/2 cup milk (add sugar, vanilla, or cinnamon if desired). Heat a pan with butter or oil over medium heat. Dip 4 bread slices in egg mixture. Cook bread until golden on both sides (2-3 minutes per side). Serve with toppings.' },
        { id: 'recipe2', title: 'Grilled Cheese Sandwhich', steps: 'Spread butter on 2 bread slices. Place 1 bread slice, buttered side down, in a pan over medium heat. Add 2-3 cheese slices. Top with the second bread slice, buttered side up. Cook until golden brown on both sides and cheese is melted (2-3 minutes per side).' },
      ];
      setRecipes(hardCodedRecipes);
      */

     //const { data } = await axios.post(`${API_URL}/recipes`);
      //setRecipes(data);
      console.log("ingredients");
      console.log(ingredients);
      try {
        const response = await axios.post(`${API_URL}/generate-recipes`, {
          ingredients,
          numRecommendations: 0, // Set to 0 to only get recipes
          numRecipes: 3
        });
        console.log(response.data.recipes);
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = useCallback(async (newTask) => {
    try {
      await axios.post(API_URL, newTask);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  }, [fetchTasks]);

  const editTaskListOnUpdate = useCallback((updatedTask, deleted = false) => {
    setTasks((prevTasks) => {
      if (deleted) {
        return prevTasks.filter((task) => task.id !== updatedTask.id);
      }
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return updatedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
        {tasks.map((task) => (
          <Task
            task={task}
            key={task.id}
            editTaskListOnUpdate={editTaskListOnUpdate}
            fetchTasks={fetchTasks}
          />
        ))}
      </Stack>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Suggested Recipes
      </Typography>
      <Stack className="recipeTitles">
      {recipes.map((recipe) => (
          <Recipe
            recipe={recipe}
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
          />
        ))}
      </Stack>
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}
