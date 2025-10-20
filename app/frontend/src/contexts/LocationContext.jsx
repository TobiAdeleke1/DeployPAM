import { 
    createContext, 
    useContext,
    useState
} from "react";

const LocationContext = createContext();

export const useLocationAppData = () => useContext(LocationContext);


export const LocationProvider = ({ children }) =>{
    const [locationApp , setLocationApp ] = useState(null);
    const [locationAppData, setLocationAppData ] = useState([]);
    return (
        <LocationContext.Provider 
            value={ 
                {
                    locationAppData, 
                    setLocationAppData, 
                    setLocationApp, 
                    locationApp
                }
            }>
            {children}
        </LocationContext.Provider>
    );
};