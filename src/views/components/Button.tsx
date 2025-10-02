import React from 'react';
import { Button as MUIButton } from '@mui/material';

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => (
  <MUIButton variant="contained" onClick={onClick}>
    {text}
  </MUIButton>
);

export default Button;



