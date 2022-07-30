import { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { arrayUnion, deleteDoc, doc, getDoc, query, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config"
import { UserAuth } from "../context/AuthContext";

const InviteLink = () => {
    const params = useParams();
    const LoggedIn = UserAuth();
    const [Workspace, setWorkspace] = useState({});
    const [isExpired, setisExpired] = useState(false);
    const [alreadyMember, setalreadyMember] = useState(false);
    const navigate = useNavigate();
    
    useEffect(()=>{
        getInvitation();
        getWorkspace();
    },[])

    const getInvitation = () =>{
        const q = doc(db,'workspaceInvite',params.workspaceid);
        getDoc(q).then((document)=>{
            if(document.data()===undefined){
                navigate('/home');
            }
            if(Timestamp.now().seconds - document.data().timestamp.seconds>60){
                deleteDoc(doc(db,'workspaceInvite',params.workspaceid));
                setisExpired(true);
            }
        })
    }

    const returnToHome = () =>{
        navigate('/home')
    }

    const acceptInvitation = ()=>{
        updateDoc(doc(db,'workspace',params.workspaceid),{
            members: arrayUnion(LoggedIn.user.uid)
        });
        Workspace.members.forEach((member)=>{
            console.log(member);
            console.log(LoggedIn.userData.FirstName + " " + LoggedIn.userData.LastName + " is now a member of " + Workspace.WorkspaceName + " (Workspace)");
            updateDoc(doc(db,'notifications',member),{
                message:arrayUnion(LoggedIn.userData.FirstName + " " + LoggedIn.userData.LastName + " is now a member of " + Workspace.WorkspaceName + " (Workspace)")
            })
        })
        navigate('/home');
    }

    const getWorkspace = ()=>{
        const q = doc(db,'workspace',params.workspaceid);
        getDoc(q).then((document)=>{
            setWorkspace(document.data());
            if(document.data().members.includes(LoggedIn.user.uid)){
                setalreadyMember(true);
            }
        });
    }

    return (
        <div className="w-screen h-screen bg-blue-200 flex items-center justify-center">
            {(!isExpired && !alreadyMember)&& (
                <div className="w-[30rem] h-[20rem] bg-white rounded-lg flex flex-col p-5 items-center justify-center">
                    <div className="mt-5 w-full">
                        <p className="text-xl text-center font-bold">You have been invited to join {Workspace.WorkspaceName}</p>
                    </div>
                    <button onClick={acceptInvitation} className="mt-5 p-3 bg-blue-200 rounded-lg text-black hover:bg-blue-300 active:bg-blue-500 active:text-white">Join Workspace</button>
                </div>
            )}
            {alreadyMember && (
                <div className="w-[30rem] h-[20rem] bg-white rounded-lg flex flex-col p-5 items-center justify-center">
                    <div className="mt-5 w-full">
                        <p className="text-xl text-center font-bold">User is already a member</p>
                    </div>
                    <button onClick={returnToHome} className="mt-5 p-3 bg-blue-200 rounded-lg text-black hover:bg-blue-300 active:bg-blue-500 active:text-white">Return to Homepage</button>
                </div>
            )}
            {isExpired && (
                <div className="w-[30rem] h-[20rem] bg-white rounded-lg flex flex-col p-5 items-center justify-center">
                    <div className="mt-5 w-full">
                        <p className="text-xl text-center font-bold">Invitation Link Expired</p>
                    </div>
                    <button onClick={returnToHome} className="mt-5 p-3 bg-blue-200 rounded-lg text-black hover:bg-blue-300 active:bg-blue-500 active:text-white">Return to Homepage</button>
                </div>
            )}
        </div>
    );
}
 
export default InviteLink;