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
    <div>
      <PersistentDrawerLeft lists={["List"]} />
      <AddTaskInput fetchTasks={fetchTasks} />
      <Stack className="listItems">
        {tasks.map((task) => (
          <Task
            task={task}
            key={task.id}
            editTaskListOnUpdate={editTaskListOnUpdate}
          />
        ))}
      </Stack>
    </div>
  );
}
