import React from "react";
import { Typography, Button } from "@mui/material";
import classnames from "classnames";

const Recipe = ({ recipe, onClick }) => {
  return (
    <div
      className={classnames("recipe")}
      onClick={onClick}
      sx={{ backgroundColor: "!important tan" }}
    >
      <div className={classnames("flex")}>
        <Typography
          noWrap
          variant="h5"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "left",
            flexGrow: 1,
            alignSelf: "center",
            fontSize: "1.125rem",
            fontWeight: "bold",
          }}
        >
          {recipe.title}
        </Typography>
      </div>
    </div>
  );
};

export default Recipe;
