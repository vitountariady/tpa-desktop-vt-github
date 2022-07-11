import {arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import {useNavigate} from "react-router-dom"
import Member from "./Member";
import Admin from "./Admin";

const WorkspaceSettingModal = (parameter) => {
    const navigate = useNavigate();
    const LoggedIn = UserAuth();
    const [IsAdmin, setIsAdmin] = useState(false);
    const [IsOnlyAdmin, setIsOnlyAdmin] = useState(false);
    const [Members, setMembers] = useState([]);
    const [link, setLink] = useState('');
    const [Admins, setAdmins] = useState([]);
    const [Visibility, setVisibility] = useState('');

    useEffect(() => {
        setMembers(parameter.workspace.data().members);
        setAdmins(parameter.workspace.data().admins);
        if(parameter.workspace.data().admins.includes(LoggedIn.user.uid)){
            setIsAdmin(true);
            if(parameter.workspace.data().admins.length===1){
                setIsOnlyAdmin(true);
            }
        }
    },[parameter.workspace])

    useEffect(()=>{
        if(IsAdmin===false){
            return;
        }
        let Button = document.getElementById("visibilityButton");
        if(parameter.workspace.data().Public){
            Button.classList.add("bg-green-500", "hover:bg-green-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-green-500");
            Button.classList.remove("bg-red-500", "hover:bg-red-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-red-500");
            setVisibility('Public')
        }else{
            Button.classList.add("bg-red-500", "hover:bg-red-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-red-500");
            Button.classList.remove("bg-green-500", "hover:bg-green-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-green-500");
            setVisibility('Private')
        }
    },[parameter.workspace.data()])

    const deleteWorkspace = () =>{
        closeBoards();
        deleteDoc(doc(db,'workspace',parameter.workspace.id));
        parameter.toggle();
        navigate('/home');
    }

    const closeBoards = () =>{
        const q = query(collection(db,'board'),where('WorkspaceID','==',parameter.workspace.id));
        getDocs(q).then((documents)=>{
            documents.docs.forEach((document)=>{
                updateDoc(doc(db,'board',document.id),{
                    Open:false
                })
            })
        })
    }


    const makeLink = async ()=>{
        setDoc(doc(db,'workspaceInvite',parameter.workspace.id),{
            timestamp: serverTimestamp(),
            workspaceID: parameter.workspace.id
        })
        setLink("localhost:3000/workspaceinvite/"+parameter.workspace.id)
    }

    const getLink =()=>{
        const q = query(doc(db,'workspaceInvite',parameter.workspace.id));
        getDoc(q).then((doc)=>{
            if(doc.data()===undefined){
                makeLink();
            }else{
                setLink("localhost:3000/workspaceinvite/"+doc.id)
            }
        })
    }

    const demoteAdmin = (id) =>{
        updateDoc(doc(db,'workspace', parameter.workspace.id),{
            admins: arrayRemove(id)
        });
    }

    const promoteMember = (id) =>{
        updateDoc(doc(db,'workspace', parameter.workspace.id),{
            admins: arrayUnion(id)
        });
    }

    const removeMember = (id)=>{
        if(Members.length===1){
            deleteWorkspace();
        }else{
            updateDoc(doc(db,'workspace', parameter.workspace.id),{
                members: arrayRemove(id),
                admins: arrayRemove(id)
            });
        }
    }


    const self = (id) =>{
        if(id === LoggedIn.user.uid){
            return true;
        }
        return false;
    }

    const togglePublic = () =>{
        updateDoc(doc(db,'workspace',parameter.workspace.id),{
            Public: !parameter.workspace.data().Public
        })
    }

    return ( 
        <div style={{background:'rgba(0,0,0,0.5)'}} className="z-20 fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div className="flex-col h-[30rem] w-[40rem] text-center items-center rounded-lg bg-white overflow-y-scroll">
                <div className="w-full h-[5rem] flex rounded-t-lg justify-start bg-white items-center p-5 sticky top-0">
                    <p className="text-3xl font-bold">{parameter.workspace.data().WorkspaceName}</p>
                </div>
                <div className="m-1 h-fit w-[20rem] flex flex-col justify-center items-start p-5 space-y-3">
                    <p className="text-2xl">Members</p>                     
                    {Admins.map((admin)=>{
                        return(
                            <Admin IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} admin={admin} demoteAdmin={demoteAdmin} removeMember={removeMember}></Admin>
                        );
                    })}
                    {Members.map((member)=>{
                         if(Admins.includes(member)){
                            return;
                        }
                        return(<Member IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} member={member} promoteMember={promoteMember} removeMember={removeMember}></Member>);
                    })}
                    {IsAdmin && (
                        <button onClick={getLink} className="h-10 pl-3 rounded-lg w-[18rem] bg-blue-500  hover:bg-blue-600 active:bg-blue-700 text-white">Generate Invite Link</button>
                        )}
                    <p>{link}</p>

                    {IsAdmin && (
                        <p className="text-2xl">Visibility</p>
                    )}
                    
                    {IsAdmin && (
                         <button onClick={togglePublic} id="visibilityButton" className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white">
                            {Visibility}
                        </button>
                    )}

                    {IsAdmin && (
                        <button onClick={deleteWorkspace} className="w-[18rem] h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Delete Workspace
                        </button>
                    )}
                </div>
                <div className="w-[38rem] pb-5 sticky bottom-0 flex flex-row-reverse">
                    <button
                        onClick={parameter.toggle}
                        className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Cancel
                    </button>
                </div>
            </div>      
        </div>
    );
}
 
export default WorkspaceSettingModal;