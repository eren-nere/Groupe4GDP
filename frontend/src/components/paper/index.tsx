import type { FC } from 'react';
import { Paper, type SxProps } from '@mui/material';

const CustomPaper: FC<Props> = ({ children, sx }) => {
  return (
    <Paper
      sx={{
        gap: 2,
        p: '20px',
        marginBottom: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

type Props = {
  children: React.ReactNode;
  sx?: SxProps;
};

export default CustomPaper;
