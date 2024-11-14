import React, { useState, useEffect, useCallback } from "react";
import { AddTaskInput } from "./components/AddTaskInput";
import { Task } from "./components/Task";
import axios from "axios";
import { API_URL } from "./utils";
import { PersistentDrawerLeft } from "./components/Drawer";
import Stack from "@mui/material/Stack";

export default function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(API_URL);
      const sortedTasks = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Reverse order
      setTasks(sortedTasks);
    } catch (err) {
      console.log(err);
    }
  }, []);

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
      return updatedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Reverse order
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
    </div>
  );
}
