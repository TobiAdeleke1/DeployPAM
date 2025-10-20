import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MoveMap from '../components/MoveMap';
import SearchBox from '../components/SearchBox';
import FloatingButton from '../components/FloatingButton';
import LocationDrawer from '../components/LocationDrawer';
import { useLocationAppData } from '../contexts/LocationContext';
import { 
  sendLocation,
  getLocationAmenities, 
} from '../client';

export default function MapView(){
  const [query, setQuery] = useState('');
  const [markerPos, setMarkerPos] = useState([51.505, -0.09]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [locationID, setLocationID] = useState(null);
  const { setLocationApp, setLocationAppData, locationAppData } = useLocationAppData();
  const [drawerOpen, setDrawerOpen ] = useState(false);

  // amentities markers
  const [amenityPos, setAmenityPos] = useState(null);
  const [amenityInfo, setAmenityInfo] = useState(null);


  useEffect(()=>{
    if (!locationID) return;
    const get_amentity = async () =>{

      try {
        const amentity_resp = await getLocationAmenities(locationID);
        setLocationAppData(amentity_resp)
        console.log(JSON.stringify(amentity_resp));
      }catch(err){
        console.log("Failed to fetch amentities", err)
      }
       
      
    }
   get_amentity();
  }, [locationID, setLocationAppData]);

  const handleLocationAdd = async() =>{
    if (!selectedPlace) return ;
    const response = await sendLocation(selectedPlace);
    console.log(response);
    setLocationID(response.id);
    setLocationApp(response);
    setDrawerOpen(true);
  };

  const handleUserPlaceSelect = (place) =>{
    console.log("In parent", place);
    const coords = [parseFloat(place.lat), parseFloat(place.lon)];
    setQuery(place.display_name);
    setMarkerPos(coords);
    setSelectedPlace(place);
    setAmenityPos(null);
    setAmenityInfo(null);

  };

  const centerOnAmenity = (coords, info)=>{
    setAmenityPos(coords);
    setAmenityInfo(info || null);
  };

  return (
      <Box 
       sx={{   
        width: '98vw',
        height: '95vh',
        position: 'relative' }}
        >
      <MapContainer 
        center={markerPos} 
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MoveMap 
          coords={markerPos}
          boundingbox={selectedPlace?.boundingbox}
        />
        <Marker position={markerPos}>
          <Popup>
            {query ? `Result: ${query}` : 'Search Locations'}
          </Popup>
        </Marker>

        {amenityPos && (
            <Marker position={amenityPos} >
              <Popup>
                <strong>{amenityInfo?.title || amenityInfo?.amenity || "Amenity"}</strong>
                {amenityInfo?.amenity ? <div>Type: {amenityInfo.amenity}</div> : null}
              </Popup>
            </Marker>
          )}
      </MapContainer>
      <SearchBox 
        open={true}
        onPick={handleUserPlaceSelect}
         />
      {selectedPlace && <FloatingButton 
        onClick={handleLocationAdd}/>}

      {locationAppData &&  <LocationDrawer 
        open={ drawerOpen}
        onClose={()=> setDrawerOpen(false)}
        onCenter={(coords, info)=> centerOnAmenity(coords,info)}
      />}
    </Box>
  );
}