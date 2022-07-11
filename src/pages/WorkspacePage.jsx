import { useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import CreateBoardModal from "../Components/CreateBoard";
import Board from "../Components/Board";


const WorkspacePage = () => {
    const params = useParams();
    const [Modal, setModal] = useState(false);
    const [Boards, setBoards] = useState([]);

    useEffect(() => {
        const q = query(collection(db,'board'),where("WorkspaceID","==",params.workspaceid));
        onSnapshot(q,(snap)=>{
            setBoards(snap.docs);
        })
    }, [params.workspaceid])


    const toggleModal = () =>{
        setModal(!Modal);
    }

    return ( 
        <div>
            {Modal && (
                <CreateBoardModal workspaceid={params.workspaceid} toggle={toggleModal} ></CreateBoardModal>
            )}
            <div className="flex flex-row pt-16">
                <Sidebar></Sidebar>
                <div className="flex flex-row overflow-x-scroll">
                    <div onClick={toggleModal} className='m-5 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 w-56 h-40 rounded-md flex flex-col justify-center items-center'>
                        <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                            <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                        </div>
                        <p>Create Board</p>
                    </div>  
                    {Boards.map((curr)=>{
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
    );
}
 
export default WorkspacePage;