import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";

const InviteNotification = (parameter) => {
    const [Workspace, setWorkspace] = useState('');
    const loggedIn = UserAuth();

    useEffect(() => {
        const q = doc(db,'workspace',parameter.workspaceid);
        getDoc(q).then((document)=>{
            setWorkspace(document.data());
        });
    }, [parameter])
    
    const acceptInvitation = () =>{
        updateDoc(doc(db,'workspace',parameter.workspaceid),{
            members: arrayUnion(loggedIn.user.uid)
        })
        updateDoc(doc(db,'notifications',loggedIn.user.uid),{
            invite: arrayRemove(parameter.workspaceid)
        })
        console.log(Workspace.members);
        Workspace.members.forEach((member)=>{
            updateDoc(doc(db,'notifications',member),{
                message:arrayUnion(loggedIn.userData.FirstName + " " + loggedIn.userData.LastName + " is now a member of " + Workspace.WorkspaceName + " (Workspace)")
            })
        })
    }

    const declineInvitation = () =>{
        updateDoc(doc(db,'notifications',loggedIn.user.uid),{
            invite: arrayRemove(parameter.workspaceid)
        })
    }

    return (
        <div>
            <div className="h-10 w-[36rem] m-5 flex flex-row justify-between space-x-10 items-center bg-neutral-300 p-7 rounded-lg">
                <p>You are invited to {Workspace.WorkspaceName}</p>
                <div className="flex flex-row space-x-3">
                    <button onClick={acceptInvitation} className="w-20 bg-blue-500  hover:bg-blue-600 active:bg-blue-700 h-8 text-white rounded-md">Accept</button>
                    <button onClick={declineInvitation} className="w-20 bg-red-500 hover:bg-red-600 active:bg-red-700 h-8 text-white rounded-md">Decline</button>
                </div>
            </div>
        </div>
    );
}
 
export default InviteNotification;