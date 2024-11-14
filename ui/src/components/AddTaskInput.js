import React, { useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { API_URL } from "../utils";

export const AddTaskInput = ({ fetchTasks }) => {
  const [newTask, setNewTask] = useState("");

  const addNewTask = useCallback(async () => {
    try {
      await axios.post(API_URL, {
        name: newTask,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      await fetchTasks();
      setNewTask("");
    } catch (err) {
      console.log(err);
    }
  }, [newTask, fetchTasks]);

  const handleKeyDown = useCallback(
    async (e) => {
      if (e.key === "Enter" && newTask.trim()) {
        await addNewTask();
      }
    },
    [newTask, addNewTask]
  );

  return (
    <div className="addTaskInput">
      <TextField
        fullWidth
        size="medium"
        label="Enter task"
        variant="outlined"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        disabled={!newTask.trim().length}
        variant="outlined"
        onClick={addNewTask}
      >
        <AddIcon />
      </Button>
    </div>
  );
};
