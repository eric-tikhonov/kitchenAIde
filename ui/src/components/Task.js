import { Button, Checkbox, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useCallback } from "react";
import { UpdateTaskForm } from "./UpdateTaskForm";
import classnames from "classnames";
import axios from "axios";
import { API_URL } from "../utils";

export const Task = ({
  task,
  fetchTasks,
  editTaskListOnUpdate,
  isRecommendation,
  removeRecommendation
}) => {
  const { id, name, completed, createdAt } = task;
  const [isComplete, setIsComplete] = useState(completed);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateTaskCompletion = useCallback(async () => {
    try {
      await axios.put(API_URL, { id, name, completed: !isComplete, createdAt });
      setIsComplete((prev) => !prev);
      editTaskListOnUpdate({ id, name, completed: !isComplete, createdAt });
    } catch (err) {
      console.log(err);
    }
  }, [id, name, isComplete, createdAt, editTaskListOnUpdate]);

  const handleDeleteTask = useCallback(async () => {
    try {
      if (isRecommendation) {
        removeRecommendation(id);
      } else {
        await axios.delete(`${API_URL}/${task.id}`);
        editTaskListOnUpdate(task, true);
      }
    } catch (err) {
      console.log(err);
    }
  }, [editTaskListOnUpdate, task, isRecommendation, removeRecommendation, id]);

  const addTaskFromRecommendation = useCallback(async () => {
    try {
      const newTask = {
        name,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      await axios.post(API_URL, newTask);
      fetchTasks();
      removeRecommendation(id);
    } catch (err) {
      console.log(err);
    }
  }, [name, fetchTasks, id, removeRecommendation]);

  return (
    <div className={classnames("task", { recommendation: isRecommendation })}>
      <div className={classnames("flex", { done: isComplete })}>
        {!isRecommendation && (
          <Checkbox
            style={{ color: "unset !important" }}
            checked={isComplete}
            onChange={handleUpdateTaskCompletion}
          />
        )}
        <div
          style={{ display: "flex", alignItems: "center", margin: "auto 0" }}
        >
          {isRecommendation && (
            <Typography
              noWrap
              variant="h4"
              color="tan"
              marginRight={1}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "left",
                flexGrow: 1,
                alignSelf: "center",
                fontSize: "1.125rem",
              }}
            >
              {"Recommendation:"}
            </Typography>
          )}
          <Typography
            noWrap
            variant="h4"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "left",
              flexGrow: 1,
              alignSelf: "center",
              fontSize: "1.125rem",
            }}
          >
            {name}
          </Typography>
        </div>
      </div>
      <div className="taskButtons">
        {!isRecommendation ? (
          <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
            <EditIcon />
          </Button>
        ) : (
          <Button variant="contained" onClick={() => addTaskFromRecommendation()}>
            <AddIcon />
          </Button>
        )}
        <Button color="error" variant="contained" onClick={() => handleDeleteTask() }>
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
