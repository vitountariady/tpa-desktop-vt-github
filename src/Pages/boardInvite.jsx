import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";

const BoardInvite = () => {
    const params = useParams();
    const LoggedIn = UserAuth();
    const [Board, setBoard] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getBoard();
    }, [])

    const acceptInvitation = ()=>{
        updateDoc(doc(db,'board',params.boardid),{
            members: arrayUnion(LoggedIn.user.uid)
        });
        navigate('/home');
    }
    

    const getBoard = ()=>{
        const q = doc(db,'board', params.boardid);
        getDoc(q).then((document)=>{
            setBoard(document.data());
        })
    }

    return ( 
        <div className="w-screen h-screen bg-blue-200 flex items-center justify-center">
            <div className="w-[30rem] h-[20rem] bg-white rounded-lg flex flex-col p-5 items-center justify-center">
                <div className="mt-5 w-full">
                    <p className="text-xl text-center font-bold">You have been invited to join {Board.BoardName}</p>
                </div>
                <button onClick={acceptInvitation} className="mt-5 p-3 bg-blue-200 rounded-lg text-black hover:bg-blue-300 active:bg-blue-500 active:text-white">Join Board</button>
            </div>
        </div>
    );
}
 
export default BoardInvite;