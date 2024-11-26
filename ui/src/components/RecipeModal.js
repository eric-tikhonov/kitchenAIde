import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const RecipeModal = ({ recipe, onClose }) => {
  return (
    <Dialog open={!!recipe} onClose={onClose}>
      <DialogTitle>{recipe.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {recipe.steps}
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
          fullWidth
          sx={{ mt: 2 }}
        >
          <CheckIcon />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;