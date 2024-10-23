import React, { useState, useEffect, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AddTaskInput } from "./components/AddTaskInput";
import { Task } from "./components/Task";
import axios from "axios";
import { API_URL } from "./utils";
import { PersistentDrawerLeft } from "./components/Drawer";
import Stack from "@mui/material/Stack";

const darkTheme = createTheme({ palette: { mode: "dark" } });

export default function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(API_URL);
      setTasks(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const editTaskListOnUpdate = useCallback((updatedTask, deleted = false) => {
    setTasks((prevTasks) => {
      if (deleted) {
        return prevTasks.filter((task) => task.id !== updatedTask.id);
      }
      return prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
    });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <PersistentDrawerLeft lists={["List"]} />
      <AddTaskInput fetchTasks={fetchTasks} />
      <Stack spacing={2}>
        {tasks.map((task) => (
          <Task
            task={task}
            key={task.id}
            editTaskListOnUpdate={editTaskListOnUpdate}
          />
        ))}
      </Stack>
    </ThemeProvider>
  );
}
