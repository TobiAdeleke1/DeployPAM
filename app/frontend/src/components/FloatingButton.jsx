import React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


export default function FloatingButton({ onClick }){
    return (
        <Fab
          color="secondary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 2000
          }}
          onClick={onClick}
        >
            <AddIcon />

        </Fab>
    );
}