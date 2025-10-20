import React from 'react';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function AmenityStepper({
    title,
    items,
    onCenter,
    limit=5,
    emptyText="No items found nearby."
}){
    const itemList = Array.isArray(items) ? items.slice(0, limit): []
    return (
        <Box sx={{ mb:2 }}>
            {title && (
                <Typography variant='subtitle1'>
                    {title}
                </Typography>
            )}

            {itemList.length ? (
                <Stepper orientation='vertical' nonLinear>
                    {itemList.map((place) =>{
                        const name = place?.tags?.name || place?.tags?.amenity || "Unnamed";
                        const amenity = place?.tags?.amenity;
                        const cuisine = place?.tags?.cuisine;
                        const lat = parseFloat(place?.lat);
                        const lon = parseFloat(place?.lon);

                        return (
                            <Step key={place.id} active>
                                <StepLabel>{name}</StepLabel>
                                <StepContent>
                                    <Typography variant='body2'>
                                        {amenity ? `Amenity: ${amenity}` :  "Amentity" }

                                    </Typography>
                                        {cuisine && (
                                            <Typography variant='body2'>
                                                Cuisine: {cuisine}
                                            </Typography>
                                        )}
                                        {Number.isFinite(lat) && Number.isFinite(lon) && (
                                            <Button
                                                size='small'
                                                variant='outlined'
                                                sx={{ mt: 1}}
                                                onClick={() => onCenter?.([lat, lon], {title: name, amenity})}
                                            >
                                                Show on Map
                                            </Button>
                                        )}
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
            ): (
                <Typography variant='body2'>
                    {emptyText}
                </Typography>
            )}

        </Box>
    );
}