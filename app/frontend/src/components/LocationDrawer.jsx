import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useLocationAppData } from '../contexts/LocationContext';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import AmenityStepper from './AmenityStepper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import DetailsIcon from '@mui/icons-material/Details';


export default function LocationDrawer({ open, onClose, onCenter}){
    const { locationApp , locationAppData } = useLocationAppData();
    const [nav, setNav] = useState(0);

    const isLoading = open && !locationApp;

    const restaurantsAndCafes = locationAppData.amenity_nodes?.filter(
        (amen) => amen?.tags?.amenity === "resturants" || amen?.tags?.amenity === "cafe"

    );
    const otherAmentities = locationAppData.amenity_nodes?.filter(
        (amen) => amen?.tags?.amenity && 
        !["restaurant", "cafe", "post_box"].includes(amen.tags.amenity)
    );

    const handleLocationAdd = ()=>{

    }

    const handleLocationDetail = () =>{
        

    }

    
    return (<Drawer
        anchor='right'
        open={open}
        onClose={onClose}
        slotProps={{
            paper:{
                sx: { width: { xs: '100%', md:360}, p:2}
            },
        }}

    >
    {isLoading ? (
     <Box>
        <CircularProgress />
     </Box>
    ) : locationApp?.id ? (
        <>
            <Typography variant='h6'>
                {locationApp.properties.name || "Selected Location"}

            </Typography>
             <Divider sx={{ my:2 }}/>
            <Typography variant='subtitle1'>
                Address: {locationApp.properties.display_name }

            </Typography>
            <Divider sx={{ my:2 }}/>

            <AmenityStepper 
                title="Nearby Resturants & Cafes"
                items={restaurantsAndCafes}
                onCenter={onCenter}
                limit={4}
                emptyText="No restaurants or cafes found nearby."
            />
        <Divider sx={{ my:2 }}/>
        <AmenityStepper 
            title="Other Amentities"
            items={otherAmentities}
            onCenter={onCenter}
            limit={8}
            emptyText="No other amenitites found nearby"
        />
        <Box
           sx={{
             mt: 'auto',
             position: 'sticky',
             bgcolor: 'background.paper',
             bottom: '2px',
             p:2
              }}
           
        >
        <BottomNavigation
            showLabels
            value={nav}
            onChange={(event, newValue) => {
            setValue(newValue);
            }}
        >
            <BottomNavigationAction onClick={handleLocationAdd} label="Add" icon={<AddLocationIcon />} />
        
            <BottomNavigationAction onClick={handleLocationDetail}  label="Detail" icon={<DetailsIcon />} />
        </BottomNavigation>
      </Box>
        </>
    ): (
        <Typography>
            No Location Data Available.
        </Typography>
    )}

    </Drawer>);
}