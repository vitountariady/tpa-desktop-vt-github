import { PlusIcon as PlusIconSolid } from "@heroicons/react/solid";
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
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
    const [searchQuery, setsearchQuery] = useState('');

    var involvedcount = 0;
    var favcount = 0;
    var publiccount = 0;

    useEffect(()=>{
        involvedcount = 0;
        favcount = 0;
        publiccount = 0;
    },[searchQuery])

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

    const deleteWorkspace = (id) =>{
        closeBoards(id);
        deleteDoc(doc(db,'workspace',id));
    }

    const closeBoards = (id) =>{
        const q = query(collection(db,'board'),where('WorkspaceID','==',id));
        getDocs(q).then((documents)=>{
            documents.docs.forEach((document)=>{
                updateDoc(doc(db,'board',document.id),{
                    Open:false
                })
            })
        })
    }
    
    return (
        <div className="w-[100vw - 2 rem] flex flex-col m-8">
            <input id="searchbar" type="text" placeholder="Search" className="border-gray-400 border-2 p-1 rounded-md mb-5" onChange={()=>{setsearchQuery(document.getElementById("searchbar").value)}} />
            {Modal && (
                <CreateWorkspaceModal toggle= {toggleModal}></CreateWorkspaceModal>
            )}
            <p className="text-3xl font-semibold pb-5">Joined Workspaces</p>
            <div className="w-full flex flex-row overflow-x-auto space-x-3 pb-5 mb-6">
                <div onClick={toggleModal} className='bg-slate-300 hover:bg-slate-200 active:bg-slate-400 w-56 h-40 rounded-md flex flex-col justify-center items-center'>
                    <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                        <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                    </div>
                    <p>Create Workspace</p>
                </div>
                {InvolvedWorkspaces.map((curr)=>{
                    if(curr.data().remove.length === curr.data().admins.length){
                        deleteWorkspace(curr.id);
                    }
                    let name = curr.data().WorkspaceName;
                    if(name.toLowerCase().includes(searchQuery.toLowerCase())){
                        involvedcount++;
                        return(
                            <Workspace key={curr.id} workspace ={curr}></Workspace>
                        );
                    }
                })}
                {(InvolvedWorkspaces.length===0 || involvedcount===0) && (
                    <p className="text-xl">Empty</p>
                )}
            </div>

            <p className="text-3xl font-semibold pb-5">Public Workspaces</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-auto space-x-3 pb-5 mb-6">
                {PublicWorkspaces.map((curr)=>{
                    if(curr.data().remove.length === curr.data().admins.length){
                        deleteWorkspace(curr.id);
                    }
                    let name = curr.data().WorkspaceName;
                    if(name.toLowerCase().includes(searchQuery.toLowerCase())){
                        publiccount++;
                        return(
                            <Workspace key={curr.id} workspace ={curr}></Workspace>
                        );
                    }
                })}
                {(PublicWorkspaces.length===0||publiccount===0) && (
                    <p className="text-xl">Empty</p>
                )}  
            </div>

            <p className="text-3xl font-semibold pb-5">Favorite Workspaces</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-auto space-x-3 pb-5 mb-6">
                {FavoriteWorkspaces.map((curr)=>{
                    if(curr.data().remove.length === curr.data().admins.length){
                        deleteWorkspace(curr.id);
                    }
                    let name = curr.data().WorkspaceName;
                    if(name.toLowerCase().includes(searchQuery.toLowerCase())){
                        favcount++;
                        return(
                            <Workspace key={curr.id} workspace ={curr}></Workspace>
                        );
                    }
                })}
                {(FavoriteWorkspaces.length===0 || favcount===0) && (
                    <p className="text-xl">Empty</p>
                )}
            </div>
        </div>
    );
}
 
export default WorkspaceTab;