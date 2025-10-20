const API_URL = import.meta.env.VITE_API_URL || ""; 


export const sendLocation = async(locationData) =>{
 
    const response = await fetch(`${API_URL}/api/locations/new/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(locationData)
    });

    if(!response.ok){
        throw new Error(`Failed to add new location`);
    }

    return response.json();

};


export const getLocationAmenities = async (locationID)=>{
    const queryParams = new URLSearchParams();
    queryParams.append("location_id", locationID);

    const response = await fetch(`${API_URL}/api/locations/overpass_detail?${queryParams.toString()}`,{
        method : 'GET',
        headers: {
            'Content-Type':'application/json'
        },
    });
    
    if(!response.ok){
        throw new Error(`No Nearby Amenities`);
    }

    return response.json();
}