import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase.config';
import CreateWorkspaceModal from './CreateWorkspace';
import Workspace from './Workspace';


const Sidebar = () => {
    const navigate = useNavigate();
    const loggedIn = UserAuth();
    const [UserData, setUserData] = useState('user');
    const [Modal, setModal] = useState(false);
    const [WorkspaceList, setWorkspaceList] = useState([]);

    const toggleModal = ()=>{
        setModal(!Modal);
    }

    useEffect(() => {
        if(Modal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [Modal])

    useEffect(()=>{
       getWorkspaceList();
       setUserData(loggedIn.userData);
    },[loggedIn])


    const getWorkspaceList = async() =>{
        const q = query(collection(db, 'workspace'));
        onSnapshot(q,(documents)=>{
            setWorkspaceList(documents.docs);
        })
    }

    const openCloseBoards = () =>{
        navigate('/closedboards');
    }

    return ( 
        <div className="bg-gray-700 h-screen w-60 pl-4 pt-8">
            {Modal && (
                <CreateWorkspaceModal toggle= {toggleModal}></CreateWorkspaceModal>
            )}
            <p className="text-white text-lg mb-6">Welcome, {UserData.FirstName}</p>
            <div className="flex items-baseline justify-start space-x-2">
                <p className="text-white text-2xl">Workspaces</p>
                <button onClick={toggleModal} className="inline-flex items-center p-1  border-2 border-gray-400 rounded-md shadow-sm text-white bg-transparent hover:border-gray-600 hover:text-gray-400 active:border-gray-800  active:text-gray-600 ">
                    <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                </button>
            </div>
            <hr className="w-40 mt-5"/>
            {WorkspaceList.map((curr)=>{
                return(
                    <Workspace workspace ={curr}></Workspace>
                );
            })}
            <div className="mt-10 w-fit flex items-center justify-start rounded-lg hover:bg-gray-600 active:bg-gray-800">
                <p onClick={openCloseBoards} className="p-1.5 text-white text-2xl">Closed Boards</p>
            </div>
        </div>
     );
}
 
export default Sidebar;