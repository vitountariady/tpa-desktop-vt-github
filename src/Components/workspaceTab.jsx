import { PlusIcon as PlusIconSolid } from "@heroicons/react/solid";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import CreateWorkspaceModal from "./CreateWorkspace";
import Workspace from "./Workspace";

const WorkspaceTab = () => {
    const loggedIn = UserAuth();
    const [Modal, setModal] = useState(false);
    const [InvolvedWorkspaces, setInvolvedWorkspaces] = useState([]);
    const [PublicWorkspaces, setPublicWorkspaces] = useState([]);
    const [FavoriteWorkspaces, setFavoriteWorkspaces] = useState([]);

    useEffect(() => {
        if(Modal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [Modal])

    const toggleModal = ()=>{
        setModal(!Modal);
    }

    useEffect(()=>{
        getInvolvedWorkspaces();
        getPublicWorkspaces();
        getFavoriteWorkspaces();
     },[loggedIn])

    const getInvolvedWorkspaces = async() =>{
        const q = query(collection(db, 'workspace'),where('members','array-contains',loggedIn.user.uid));
        onSnapshot(q,(documents)=>{
            setInvolvedWorkspaces(documents.docs);
        })
    }
    
    const getPublicWorkspaces = async() =>{
        const q = query(collection(db, 'workspace'),where('Public','==',true));
        onSnapshot(q,(documents)=>{
            setPublicWorkspaces(documents.docs);
        })
    }
    
    const getFavoriteWorkspaces = async() =>{
        const q = query(collection(db, 'workspace'),where('Favorite','array-contains',loggedIn.user.uid));
        onSnapshot(q,(documents)=>{
            setFavoriteWorkspaces(documents.docs);
        })
    }
    
    return (
        <div className="w-[100vw - 2 rem] flex flex-col m-8">
            {Modal && (
                <CreateWorkspaceModal toggle= {toggleModal}></CreateWorkspaceModal>
            )}
            <p className="text-3xl font-semibold pb-5">Involved Workspaces</p>
            <div className="w-full flex flex-row overflow-x-scroll space-x-3 pb-5 mb-6">
                <div onClick={toggleModal} className='bg-slate-300 hover:bg-slate-200 active:bg-slate-400 w-56 h-40 rounded-md flex flex-col justify-center items-center'>
                    <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                        <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                    </div>
                    <p>Create Workspace</p>
                </div>
                {InvolvedWorkspaces.map((curr)=>{
                    return(
                        <Workspace workspace ={curr}></Workspace>
                    );
                })}
                {InvolvedWorkspaces.length==0 && (
                    <p>Empty</p>
                )}
            </div>

            <p className="text-3xl font-semibold pb-5">Public Workspaces</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-scroll space-x-3 pb-5 mb-6">
                {PublicWorkspaces.map((curr)=>{
                    return(
                        <Workspace workspace ={curr}></Workspace>
                    );
                })}
                {PublicWorkspaces.length==0 && (
                    <p>Empty</p>
                )}  
            </div>

            <p className="text-3xl font-semibold pb-5">Favorite Workspaces</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-scroll space-x-3 pb-5 mb-6">
                {FavoriteWorkspaces.map((curr)=>{
                    return(
                        <Workspace workspace ={curr}></Workspace>
                    );
                })}
                {FavoriteWorkspaces.length==0 && (
                    <p>Empty</p>
                )}
            </div>
        </div>
    );
}
 
export default WorkspaceTab;