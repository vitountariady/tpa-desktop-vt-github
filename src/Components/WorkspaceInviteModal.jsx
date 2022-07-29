import { ExclamationCircleIcon, ExclamationCircleIon, SearchIcon } from "@heroicons/react/solid";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase.config";


const WorkspaceInviteModal = (parameter) => {
    const [link, setLink] = useState('');
    const [ShowWarning, setShowWarning] = useState('');
    const [ShowSuccess, setShowSuccess] = useState('');

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

    const sendInvite = (id) =>{
        updateDoc(doc(db,'notifications',id),{
            invite: arrayUnion(parameter.workspace.id)
        })
    }

    const inviteUser = () =>{
        let email = document.getElementById("useremailbar").value
        const q1 = query(collection(db,'users'),where("email" ,'==',email))
        getDocs(q1).then((documents)=>{
            const user = documents.docs[0];
            if(user===undefined){
                setShowWarning("User not found");
            }else{
                getDoc(doc(db,'notifications',user.id)).then((notifications)=>{
                    if(parameter.workspace.data().members.includes(user.id)){
                        setShowWarning('Invited user is already a member')
                    }else if(notifications.data().invite.includes(parameter.workspace.id)){
                        setShowWarning('Invite already sent')
                    }else{
                        sendInvite(user.id);
                        setShowWarning('');
                        setShowSuccess('User Successfully Invited');
                    }
                })
            }
        })
    }

    const makeLink = async ()=>{
        setDoc(doc(db,'workspaceInvite',parameter.workspace.id),{
            timestamp: serverTimestamp(),
            workspaceID: parameter.workspace.id
        })
        setLink("localhost:3000/workspaceinvite/"+parameter.workspace.id)
    }

    return (
        <div className="z-10 bg-transparent fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div className="flex-col h-[30rem] w-[40rem] text-center z-100 items-center rounded-lg bg-white overflow-y-scroll">
                <div className="w-full h-[4rem] flex rounded-t-lg justify-start items-center bg-white p-5 sticky top-0">
                    <p className="text-3xl font-bold">{parameter.workspace.data().WorkspaceName}</p>
                </div>
                <div className="m-1 h-fit w-[20rem] flex flex-col justify-center items-start p-5 space-y-3">
                    <button onClick={getLink} className="h-10 pl-3 rounded-lg w-[18rem] bg-blue-500  hover:bg-blue-600 active:bg-blue-700 text-white">Generate Invite Link</button>
                    <p>{link}</p>
                    <p className="text-xl font-semibold">Invite User via Email</p>
                    <div className="h-10 flex flex-row items-center bg-neutral-100">
                        <input type="text" id="useremailbar" placeholder="Input User Email" className="w-[18rem] h-10 border-gray-400 border-2 p-2 rounded-l-md"/>
                        <div onClick={inviteUser} className="w-10 h-10 flex items-center p-2 bg-blue-500 rounded-r-md ">
                            <SearchIcon className="fill-white"></SearchIcon>
                        </div>
                    </div>
                    {ShowWarning!=='' && (
                        <div className="w-fit  py-2 px-4 h-fit bg-red-500 rounded-lg flex flex-row items-center justify-center space-x-2">
                            <ExclamationCircleIcon className="w-5 h-5 fill-white"></ExclamationCircleIcon>
                            <p className="text-white text-sm">{ShowWarning}</p>
                        </div>
                    )}
                    {ShowSuccess!=='' &&(
                        <div className="w-fit  py-2 px-4 h-fit bg-green-500 rounded-lg flex flex-row items-center justify-center space-x-2">
                        <p className="text-white text-sm">{ShowSuccess}</p>
                    </div>
                    )}
                    <div className="w-[36rem] pb-5 bottom-0 flex flex-row-reverse">
                    <button
                        onClick={parameter.toggle}
                        className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Cancel
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}
 
export default WorkspaceInviteModal;