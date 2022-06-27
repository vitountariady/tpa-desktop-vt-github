import { getAuth, onAuthStateChanged } from "firebase/auth";
import { arrayUnion, doc, getDoc, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase.config";

const InviteLinkPage = () => {
    const auth = getAuth();
    const navigate= useNavigate();
    const params = useParams();
    const [workspace, setWorkspace] = useState([]);
    const [userid, setUserid] = useState('');

    useEffect(()=>{
        getWorkspace();
    },[])

    function AddMember(){
        updateDoc(doc(db,'workspace',params.workspaceid),{
            userUID: arrayUnion(userid)
        })
        navigate('/homepage');
    }

    onAuthStateChanged(auth,(user)=>{
        if(user){
            setUserid(user.uid);
        }else{
            navigate('/');
        }
    })

    async function getWorkspace(){
        const q = query(doc(db,'workspace',params.workspaceid));
        const docs = await getDoc(q);
        // console.log(docs.data().WorkspaceName);
        setWorkspace(docs.data());
    }

    return ( 
        <div className="w-screen h-screen bg-blue-200 flex items-center justify-center">
            <div className="w-[30rem] h-[20rem] bg-white rounded-lg flex flex-col p-5 items-center justify-center">
                <div className="mt-5 w-full">
                    <p className="text-xl text-center font-bold">You have been invited to join {workspace.WorkspaceName}</p>
                </div>
                <button onClick={AddMember} className="mt-5 p-3 bg-blue-200 rounded-lg text-black hover:bg-blue-300 active:bg-blue-500 active:text-white">Accept invitation</button>
            </div>
        </div>
     );
}
 
export default InviteLinkPage;