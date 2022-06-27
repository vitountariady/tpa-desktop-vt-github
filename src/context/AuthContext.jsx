import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {doc, onSnapshot} from 'firebase/firestore'
import {db} from '../firebase.config'
import { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
const auth = getAuth();

const UserContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [user,setUser] = useState({});
    const [userData, setUserData] = useState({});
    const navigate= useNavigate();
    const location = useLocation();

    useEffect(()=>{
        var getData;
        const unsub = onAuthStateChanged(auth,async (curr)=>{
            if(curr){
                setUser(curr);
            }else{
                return;
            }

            getData= onSnapshot(doc(db,'users',curr.uid),(s)=>{
                setUserData(s.data());
            });
        });
        return ()=>{
            unsub();
        };
    },[location])


    return(
        <UserContext.Provider value={{user,userData,navigate}}>
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = ()=>{
    return useContext(UserContext);
};