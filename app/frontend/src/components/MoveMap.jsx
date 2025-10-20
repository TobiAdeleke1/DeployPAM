import React, { useEffect } from "react";
import { useMap } from 'react-leaflet';
import L from 'leaflet';


export default function MoveMap({ coords, boundingbox }){
    const map = useMap();

    useEffect(()=>{
        if (!coords || coords.length !== 2) return;

        if (boundingbox?.length === 4){
            const [south, north, west, east] = boundingbox.map(Number);
            const bounds = L.latLngBounds([ [south, west], [north, east] ]);
             map.fitBounds(bounds, { padding: [24, 24] });
        }else{
            map.flyTo(coords, 14, { duration: 0.8});

            setTimeout(()=> {
                map.panBy([0, -100]);

            }, 900);
        }
    }, [coords, boundingbox, map]);


    return null;
}