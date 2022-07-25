import { CogIcon, HeartIcon } from "@heroicons/react/solid";
import { arrayRemove, arrayUnion, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { Cog } from "heroicons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import WorkspaceSettingModal from "./WorkspaceSettingModal";

const Workspace = (parameter) => {
    const loggedIn = UserAuth();
    const [Modal, setModal] = useState(false);
    const [IsFavorite, setIsFavorite] = useState(false);

    const toggleModal = ()=>{
        setModal(!Modal);
    }

    const addToFavorite =()=>{
        updateDoc(doc(db,'workspace',parameter.workspace.id),{
            Favorite: arrayUnion(loggedIn.user.uid)
        })
    }
    
    const removeFavorite =()=>{
        updateDoc(doc(db,'workspace',parameter.workspace.id),{
            Favorite: arrayRemove(loggedIn.user.uid)
        })
    }

    const handleFavorite = ()=>{
        if(IsFavorite){
            removeFavorite();
        }else{
            addToFavorite();
        }
    }

    useEffect (()=>{
        const q = query(doc(db,'workspace',parameter.workspace.id));
        onSnapshot(q,(document)=>{
            const Fav = document.data().Favorite;
            if(Fav!=null  ){
                if(Fav.includes(loggedIn.user.uid)){
                    setIsFavorite(true);
                }else{
                    setIsFavorite(false);
                }
            }
        })
    },[])

    useEffect(() => {
        if(Modal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [Modal])

    if(!parameter.workspace.data().members.includes(loggedIn.user.uid) && !parameter.workspace.data().Public){
        return;
    }

    return ( 
        <div className='w-56 h-40'>
            <Link to = {'/workspace/'+parameter.workspace.id}>
                <div className="rounded-t-lg bg-slate-300 hover:bg-slate-200 active:bg-slate-400 flex flex-col justify-center items-center h-[80%]">
                    <p className="text-xl font-bold">{parameter.workspace.data().WorkspaceName}</p>
                </div>
            </Link>
                <div className="bg-slate-300 h-[20%] w-[100%] rounded-b-lg flex justify-center items-center">
                    <div onClick={toggleModal}  className="w-[50%] h-full hover:bg-slate-200 active:bg-slate-400 rounded-bl-lg flex justify-center items-center">
                        <CogIcon className="h-6 w-6 fill-black"></CogIcon>
                    </div>
                    <div onClick={handleFavorite} className="w-[50%] h-full hover:bg-slate-200 active:bg-slate-400 rounded-br-md flex justify-center items-center">
                        {!IsFavorite && (
                            <HeartIcon id="heart" className="h-6 w-6 fill-transparent stroke-black"></HeartIcon>
                        )}
                        {IsFavorite && (
                            <HeartIcon id="heart" className="h-6 w-6 fill-transparent stroke-black fill-red-700"></HeartIcon>
                        )}
                    </div>
                </div>
                {Modal && <WorkspaceSettingModal toggle={toggleModal} workspace= {parameter.workspace}></WorkspaceSettingModal>}
        </div>
     );
}
 
export default Workspace;