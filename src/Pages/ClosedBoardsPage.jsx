import Board from "../Components/Board";
import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Sidebar from "../Components/Sidebar";
import { db } from "../firebase.config";
import { UserAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";


const ClosedBoardsPage = () => {
    const [Boards, setBoards] = useState([]);
    const loggedIn = UserAuth();

    useEffect(() => {
        const q = query(collection(db,'board'),where('Open','!=',true));
        onSnapshot(q,(snap)=>{
            console.log(snap.docs);
            setBoards(snap.docs);
        })
    }, [loggedIn])

    return ( 
        <div>
            <Navbar></Navbar>
            <div className="flex flex-row pt-16">
                <div className="flex flex-row overflow-x-scroll">
                    {Boards.length===0 && (
                        <p className="text-xl absolute left-[50%] top-[50%]">Empty</p>
                    )}
                    
                    {Boards.map((curr)=>{
                        console.log(curr.data());
                        if(!curr.data().admins.includes(loggedIn.user.uid)){
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
 
export default ClosedBoardsPage;