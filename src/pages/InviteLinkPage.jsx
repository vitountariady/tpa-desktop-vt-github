import { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { arrayUnion, doc, getDoc, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config"
import { UserAuth } from "../context/AuthContext";

const InviteLink = () => {
    const params = useParams();
    const LoggedIn = UserAuth();
    const [Workspace, setWorkspace] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{
        getWorkspace();
    },[])

    const acceptInvitation = ()=>{
        updateDoc(doc(db,'workspace',params.workspaceid),{
            members: arrayUnion(LoggedIn.user.uid)
        });
        navigate('/home');
    }

    const getWorkspace = ()=>{
        const q = doc(db,'workspace',params.workspaceid);
        getDoc(q).then((document)=>{
            setWorkspace(document.data());
        });
    }

    return ( 
        <div className="w-screen h-screen bg-blue-200 flex items-center justify-center">
            <div className="w-[30rem] h-[20rem] bg-white rounded-lg flex flex-col p-5 items-center justify-center">
                <div className="mt-5 w-full">
                    <p className="text-xl text-center font-bold">You have been invited to join {Workspace.WorkspaceName}</p>
                </div>
                <button onClick={acceptInvitation} className="mt-5 p-3 bg-blue-200 rounded-lg text-black hover:bg-blue-300 active:bg-blue-500 active:text-white">Join Workspace</button>
            </div>
        </div>
    );
}
 
export default InviteLink;