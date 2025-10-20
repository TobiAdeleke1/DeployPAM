import React, { useCallback, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Fade from '@mui/material/Fade';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';


export default function SearchBox({
    open,
    onPick
}){
    const [searchQuery, setSearchQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [searchLoading, setSearchLoading ] = useState(false);
    const debounceRef = useRef(null);
    
    const fetchSuggestion = async(query) =>{
        setSearchLoading(true);

        try{
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2`;
            const res = await fetch(url);
            const data = await res.json();
            if(data.length){
                setOptions(data);
            }else{
                setOptions([]);
            }

        }catch(err){
            console.log(err);
            setOptions([]);
        }finally{
            setSearchLoading(false);
        }
    };

    const handleInputChange = (_, value, reason) =>{
        setSearchQuery(value);
        if(reason === 'input'){
            if(debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(()=>fetchSuggestion(value), 600);
        }
    };

    return (
        <Fade in={open}>
            <Paper 
                elevation={3}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    zIndex: 2000,
                    minWidth: 300,
                    maxWidth: '90vw'

                }}
            >
            <Autocomplete
                fullWidth
                options={options}
                getOptionLabel={(opt) => opt?.display_name ?? ''}
                filterOptions={(x) => x}
                loading={searchLoading}
                onInputChange={handleInputChange}
                inputValue={searchQuery}
                onChange={ (_, opt) =>{
                    if(opt) onPick(opt); 
                }}
                slotProps={{
                    popper: { sx: { zIndex: 4000 } }, // above Leaflet controls
                }}
                renderInput={(params)=>(
                    <TextField
                        {...params}
                        size='small'
                        placeholder=' Search a place (e.g London)'
                        variant='outlined'
                        fullWidth
                     />

                )}
                renderOption={(props, option) =>(
                    <li {...props} key={option.place_id}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ display: 'flex', width: 44 }}>
                            <LocationOnIcon color="action" />
                            </Grid>
                            <Grid item sx={{ width: 'calc(100% - 44px)' }}>
                            <Typography sx={{ fontWeight: 600 }}>
                                {option.name || option.display_name.split(',')[0]}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {option.display_name}
                            </Typography>
                            </Grid>
                        </Grid>
                    </li>
                )}     
            />         
            </Paper>
        </Fade>
    );
}