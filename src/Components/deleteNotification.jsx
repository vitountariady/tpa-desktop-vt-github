import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";

const DeleteNotification = (parameter) => {
    const [WorkspaceName, setWorkspaceName] = useState('');
    const loggedIn = UserAuth();

    useEffect(() => {
        const q = doc(db,'workspace',parameter.workspaceid);
        getDoc(q).then((document)=>{
            setWorkspaceName(document.data().WorkspaceName);
        });
    }, [parameter])
    
    const acceptInvitation = () =>{
        updateDoc(doc(db,'workspace',parameter.workspaceid),{
            remove: arrayUnion(loggedIn.user.uid)
        })
        updateDoc(doc(db,'notifications',loggedIn.user.uid),{
            delete: arrayRemove(parameter.workspaceid)
        })
    }

    const declineInvitation = () =>{
        updateDoc(doc(db,'workspace',parameter.workspaceid),{
            remove: []
        })
        updateDoc(doc(db,'notifications',loggedIn.user.uid),{
            delete: arrayRemove(parameter.workspaceid)
        })
    }

    return (
        <div>
            <div className="h-10 w-[36rem] m-5 flex flex-row justify-between space-x-10 items-center bg-neutral-300 p-7 rounded-lg">
                <p>Do you agree to delete {WorkspaceName}</p>
                <div className="flex flex-row space-x-3">
                    <button onClick={acceptInvitation} className="w-20 bg-blue-500  hover:bg-blue-600 active:bg-blue-700 h-8 text-white rounded-md">Accept</button>
                    <button onClick={declineInvitation} className="w-20 bg-red-500 hover:bg-red-600 active:bg-red-700 h-8 text-white rounded-md">Decline</button>
                </div>
            </div>
        </div>
    );
}
 
export default DeleteNotification;