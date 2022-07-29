import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase.config";
import { UserAuth } from "./AuthContext";

const { createContext } = require("react");

const NotifContext = createContext();

export const NotifContextProvider = ({children})=>{
    const [notifications, setnotifications] = useState({});
    const {user} = UserAuth();

    useEffect(() => {
        var unsub;
        if(user){
            if(user.uid!==undefined){
                const document = doc(db,'notifications', user.uid);
                unsub = onSnapshot(document,(snap)=>{
                    if(snap){
                        setnotifications(snap.data());
                    }
                })
            }
        }

        return unsub;
    }, [user])
    
    return <NotifContext.Provider value={{notifications}}>{children}</NotifContext.Provider>
};

export const GetNotifs = () =>{
    return useContext(NotifContext);
};