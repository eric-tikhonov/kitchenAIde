import { Button, Checkbox, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState, useCallback } from "react";
import { UpdateTaskForm } from "./UpdateTaskForm";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";

export const Task = ({ task, fetchTasks, editTaskListOnUpdate }) => {
  const { id, name, completed } = task;
  const [isComplete, setIsComplete] = useState(completed);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateTaskCompletion = useCallback(async () => {
    try {
      await axios.put(API_URL, { id, name, completed: !isComplete });
      setIsComplete((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  }, [id, name, isComplete]);

  const handleDeleteTask = useCallback(async () => {
    try {
      await axios.delete(`${API_URL}/${task.id}`);
      editTaskListOnUpdate(task, true);
    } catch (err) {
      console.log(err);
    }
  }, [editTaskListOnUpdate, task]);

  return (
    <div className="task">
      <div className={classnames("flex", { done: isComplete })}>
        <Checkbox style={{color: "unset !important"}}checked={isComplete} onChange={handleUpdateTaskCompletion} />
        <Typography
          noWrap
          variant="h4"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          {name}
        </Typography>
      </div>
      <div className="taskButtons">
        <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
          <EditIcon />
        </Button>
        <Button color="error" variant="contained" onClick={handleDeleteTask}>
          <DeleteIcon />
        </Button>
      </div>
      <UpdateTaskForm
        fetchTasks={fetchTasks}
        editTaskListOnUpdate={editTaskListOnUpdate}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        task={task}
      />
    </div>
  );
};
