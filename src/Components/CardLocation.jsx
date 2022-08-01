import { useEffect } from "react";
import { useState } from "react"
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api"
import {
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";


const CardLocation = (parameter) =>{
    const {isLoaded} = useLoadScript({
        googleMapApiKey: "AIzaSyDNE5gT8kf4u9VPmEzfdZQRODzIXXZ5sjk"
    })
    const[Center, setCenter] = useState({ lat: -6.201994754217926, lng: 106.78148746490479 });
    const [CenterMarker,setCenterMarker] = useState(false);
    
    useEffect(() => {
        onSnapshot(doc(db, "cardLocation" ,parameter.card.id),(snap)=>{
            if(snap.data()!==undefined){ 
                setCenter({ lat: snap.data().marker.lat, lng: snap.data().marker.lng });
                setCenterMarker({
                  lat: snap.data().marker.lat,
                  lng: snap.data().marker.lng,
                });
            }else{
                setCenter({ lat: -6.201994754217926, lng: 106.78148746490479});
                setCenterMarker(false);
            }
        })
    }, []);

    if(!isLoaded) return null;
    const handleClick = (e) => {
        setCenterMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setDoc(doc(db, "cardLocation", parameter.card.id), {
          marker: { lat: e.latLng.lat(), lng: e.latLng.lng() },
        });
    };

    return (
        <div className="relative">
          <div
            onClick={() => {
              deleteDoc(doc(db, "cardLocation", parameter.card.id));
              setCenterMarker(false);
            }}
            className="cursor-pointer absolute text-gray-500 right-[5rem] top-2"
            href=""
          >
            Remove Marker
          </div>
          <p className="p-2 font-medium">Card Location</p>
          <div className="p-3">
            <GoogleMap
              onClick={handleClick}
              center={Center}
              zoom={15}
              mapContainerClassName="w-full h-[32rem]"
            >
              {CenterMarker && <Marker position={CenterMarker} />}
            </GoogleMap>
          </div>
        </div>
      );
}
export default CardLocation
