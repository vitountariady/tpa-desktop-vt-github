import { useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import CreateBoardModal from "../Components/CreateBoard";
import Board from "../Components/Board";
import Navbar from "../Components/Navbar";
import { UserAuth } from "../context/AuthContext";


const WorkspacePage = () => {
    const params = useParams();
    const [Modal, setModal] = useState(false);
    const [Boards, setBoards] = useState([]);
    const [Workspace, setWorkspace] = useState([]);
    const [isBoardAdmin, setisBoardAdmin] = useState(false);

    useEffect(() => {
        const q1 = query(doc(db,'workspace',params.workspaceid));
        onSnapshot(q1,(snap)=>{
            console.log(snap.data());
            setWorkspace(snap.data());
        })
        const q = query(collection(db,'board'),where("WorkspaceID","==",params.workspaceid));
        onSnapshot(q,(snap)=>{
            setBoards(snap.docs);
        })
    }, [params.workspaceid])

    const toggleModal = () =>{
        setModal(!Modal);
    }

    const deleteBoard = (id) =>{
        deleteDoc(doc(db,'board',id));
    }

    return ( 
        <div>
            <Navbar></Navbar>
            {Modal && (
                <CreateBoardModal workspaceid={params.workspaceid} toggle={toggleModal} ></CreateBoardModal>
                )}
            <p className="mt-24 ml-6 text-3xl font-semibold text-black">{Workspace.WorkspaceName}</p>
            <p className="mt-2 ml-6 w-fit p-2 rounded-xl text-white text-md font-semibold bg-slate-700">Workspace</p>
            <div className="flex flex-row">
                <div className="flex flex-row overflow-x-scroll">
                    <div onClick={toggleModal} className='m-5 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 w-56 h-40 rounded-md flex flex-col justify-center items-center'>
                        <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                            <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                        </div>
                        <p>Create Board</p>
                    </div>
                    <div className="pt-5">
                        {Boards.map((curr)=>{
                            if(curr.data().remove.length === curr.data().admins.length){
                                deleteBoard(curr.id);
                            }
                            if(!curr.data().Open){
                                return;
                            }
                            return(
                                <Board board={curr}></Board>
                            )
                        })} 
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default WorkspacePage;