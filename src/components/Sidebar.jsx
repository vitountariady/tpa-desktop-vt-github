import WorkspaceDiv from "./WorkspaceDiv";
import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.config";
import WorkspaceModal from "./WorkspaceModal";

const Sidebar = () => {
    const [username, setName] = useState('user');
    const [useruid, setUserUID] = useState('');
    const [workspaceList, setWorkspaceList] = useState([]);
    const [workspaceModal, setWorkSpaceModal] = useState(false);
    

    const auth = getAuth();

    useEffect(()=>{
        const q = query(collection(db,'workspace'),where('userUID','array-contains', useruid));
        onSnapshot(q,(docs)=>{
            setWorkspaceList([]);
            docs.forEach(dox=>{
            setWorkspaceList((oldArray)=>[...oldArray,{...dox.data(), id:dox.id}]);
            });
        });
     },[useruid])

     useEffect(()=>{
        const q = query(collection(db,'workspace'),where('admins','array-contains', useruid));
        onSnapshot(q,(docs)=>{
            docs.forEach(dox=>{
                setWorkspaceList((oldArray)=>[...oldArray,{...dox.data(), id:dox.id}]);
            });
        });
     },[useruid])

     useEffect(() => {
        if(workspaceModal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [workspaceModal])

     onAuthStateChanged(auth,(user)=>{
        if(user){
            getUserDetails(user);
        }else{

        }
    })

    async function getUserDetails(user){
        const uid = user.uid;
        const q = query(collection(db,'users'), where('UID','==',uid));
        const docs = await getDocs(q);
        docs.forEach(dok => {
            // console.log(doc.data());
            setName(dok.data().FirstName);
            setUserUID(dok.data().UID);
        });
    }

    function ToggleWorkspaceModal(){
        setWorkSpaceModal(!workspaceModal);
    }  

    return (
    <div className="bg-gray-700 h-screen w-60 pl-4 pt-8">
         {workspaceModal && (
             <WorkspaceModal uid={useruid} close={ToggleWorkspaceModal}></WorkspaceModal>
             )}
        <p className="text-white text-lg mb-6">Welcome, {username}</p>
        <div className="flex items-baseline justify-start space-x-2">
            <p className="text-white text-2xl">Workspaces</p>
            <button onClick={ToggleWorkspaceModal} className="inline-flex items-center p-1  border-2 border-gray-400 rounded-md shadow-sm text-white bg-transparent hover:border-gray-600 hover:text-gray-400 active:border-gray-800  active:text-gray-600 ">
                <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
            </button>
        </div>
        <hr className="w-40 mt-5"/>
        {workspaceList.map((workspace)=>{
            return(
                <WorkspaceDiv key={workspace.id} id={workspace.id} content={workspace.WorkspaceName}>
                </WorkspaceDiv>
            );
        })}
    </div> 
);
}
 
export default Sidebar;