import {useEffect } from "react";
import {useLocation} from "react-router-dom";

export default function WebTitle() {
    let userLocation = useLocation();
    
    useEffect(() =>{
            document.title = `Eduapp - ${userLocation.pathname.substring(1, 2).toUpperCase()}${userLocation.pathname.substring(2)}`
    }, [userLocation]);

    return <></>;
}
