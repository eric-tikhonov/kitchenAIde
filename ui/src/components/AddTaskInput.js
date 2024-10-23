import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { API_URL } from "../utils";

export const AddTaskInput = ({ fetchTasks }) => {
  const [newTask, setNewTask] = useState("");

  const addNewTask = async () => {
    try {
      await axios.post(API_URL, {
        name: newTask,
        completed: false,
      });
      await fetchTasks();
      setNewTask("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await addNewTask();
    }
  };

  return (
    <div>
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
          disabled={!newTask.length}
          variant="outlined"
          onClick={addNewTask}
        >
          <AddIcon />
        </Button>
      </div>
    </div>
  );
};
