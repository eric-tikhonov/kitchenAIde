import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import classnames from "classnames";

const Recipe = ({ recipe, onClick }) => {
  return (
    <Card className={classnames("recipe")} onClick={onClick} sx={{ backgroundColor: "tan" }}>
      <CardContent>
        <Typography
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
          {recipe.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            textAlign: "left",
            mt: 2,
          }}
        >
          {recipe.formattedRecipe}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Recipe;