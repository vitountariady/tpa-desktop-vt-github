import {arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import {useNavigate} from "react-router-dom"
import Member from "./Member";
import Admin from "./Admin";
import { ExclamationCircle } from "heroicons-react";
import WorkspaceInviteModal from "./WorkspaceInviteModal";

const WorkspaceSettingModal = (parameter) => {
    console.log(parameter.workspace)
    const navigate = useNavigate();
    const LoggedIn = UserAuth();
    const [IsAdmin, setIsAdmin] = useState(false);
    const [IsOnlyAdmin, setIsOnlyAdmin] = useState(false);
    const [Members, setMembers] = useState([]);
    const [Admins, setAdmins] = useState([]);
    const [Visibility, setVisibility] = useState('');
    const [ShowWarning, setShowWarning] = useState('');
    const [InviteModal, setInviteModal] = useState(false);

    const toggleInviteModal = () =>{
        setInviteModal(!InviteModal);
    }

    useEffect(() => {
        setMembers(parameter.workspace.data().members);
        setAdmins(parameter.workspace.data().admins);
        if(parameter.workspace.data().admins.includes(LoggedIn.user.uid)){
            setIsAdmin(true);
            if(parameter.workspace.data().admins.length===1){
                setIsOnlyAdmin(true);
            }
        }else{
            setIsAdmin(false);
            setIsOnlyAdmin(false);
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

    const applyDelete = () =>{
        updateDoc(doc(db,'workspace', parameter.workspace.id),{
            remove: [LoggedIn.user.uid]
        });
        Admins.forEach((Admin)=>{
            if(!self(Admin)){
                updateDoc(doc(db,'notifications',Admin),{
                    delete:arrayUnion(parameter.workspace.id)
                })
            }
        })
    }

    const removeMember = (id)=>{
        console.log(self(id))
        if(Members.length===1){
            deleteWorkspace();
        }else if(self(id)&&IsOnlyAdmin && IsAdmin){
            setShowWarning('Please Assign Admin Role to Another Member');
            return;
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
                            <Admin key={admin} IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} admin={admin} demoteAdmin={demoteAdmin} removeMember={removeMember}></Admin>
                        );
                    })}
                    {Members.map((member)=>{
                         if(Admins.includes(member)){
                            return;
                        }
                        return(<Member key={member} IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} member={member} promoteMember={promoteMember} removeMember={removeMember}></Member>);
                    })}
                    {IsAdmin && (
                        <button onClick={toggleInviteModal} className="h-10 pl-3 rounded-lg w-[18rem] bg-blue-500  hover:bg-blue-600 active:bg-blue-700 text-white">Invite Users to Workspace</button>
                    )}

                    {InviteModal && (
                        <WorkspaceInviteModal toggle={toggleInviteModal} workspace ={parameter.workspace}></WorkspaceInviteModal>
                    )}

                    {IsAdmin && (
                        <p className="text-2xl">Visibility</p>
                    )}
                    
                    {IsAdmin && (
                         <button onClick={togglePublic} id="visibilityButton" className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white">
                            {Visibility}
                        </button>
                    )}

                    {IsAdmin && (
                        <button onClick={applyDelete} className="w-[18rem] h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Delete Workspace
                        </button>
                    )}
                    {ShowWarning!=='' && (
                        <div className="w-fit absolute top-1 left-[50%] translate-x-[-50%] py-2 px-4 h-fit bg-red-500 rounded-lg flex flex-row items-center justify-center space-x-2">
                            <ExclamationCircle className="fill-white"></ExclamationCircle>
                            <p className="text-white text-sm">{ShowWarning}</p>
                        </div>
                    )}
                </div>
                <div className="w-[38rem] pb-5 bottom-0 flex flex-row-reverse">
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