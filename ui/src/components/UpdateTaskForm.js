import React, { useState, useCallback } from "react";
import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { API_URL } from "../utils";

export const UpdateTaskForm = ({ editTaskListOnUpdate, isDialogOpen, setIsDialogOpen, task }) => {
  const { id, completed } = task;
  const [taskName, setTaskName] = useState(task.name);

  const handleUpdateTaskName = useCallback(async () => {
    if (taskName === task.name) return;

    try {
      const updatedTask = { id, name: taskName, completed };
      await axios.put(API_URL, updatedTask);
      editTaskListOnUpdate(updatedTask);
      setTaskName(taskName);
    } catch (err) {
      console.log(err);
    }
  }, [taskName, task, completed, editTaskListOnUpdate]);

  const handleKeyDown = useCallback(async (e) => {
    if (e.key === "Enter" && taskName.trim()) {
      await handleUpdateTaskName();
      setIsDialogOpen(false);
    }
  }, [handleUpdateTaskName, setIsDialogOpen, taskName]);

  return (
    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogTitle>Edit Task</DialogTitle>
      <div className="dialog">
        <TextField
          size="small"
          label="Task"
          variant="outlined"
          defaultValue={task.name}
          onChange={(e) => setTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          onClick={async () => {
            await handleUpdateTaskName();
            setIsDialogOpen(false);
          }}
          disabled={!taskName.length}
        >
          <CheckIcon />
        </Button>
      </div>
    </Dialog>
  );
};
