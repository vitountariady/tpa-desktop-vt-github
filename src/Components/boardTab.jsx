import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import Board from "./Board";

const BoardTab = () => {
    const loggedIn = UserAuth();
    const [InvolvedBoards, setInvolvedBoards] = useState([]);
    const [PublicBoards, setPublicBoards] = useState([]);
    const [FavoriteBoards, setFavoriteBoards] = useState([]);

    const getInvolvedBoards = async() =>{
        const q = query(collection(db, 'board'),where('members','array-contains',loggedIn.user.uid));
        onSnapshot(q,(documents)=>{
            setInvolvedBoards(documents.docs);
        })
    }
    
    const getPublicBoards= async() =>{
        const q = query(collection(db, 'board'),where('Public','==','public'));
        onSnapshot(q,(documents)=>{
            setPublicBoards(documents.docs);
        })
    }
    
    const getFavoriteBoards = async() =>{
        const q = query(collection(db, 'board'),where('Favorite','array-contains',loggedIn.user.uid));
        onSnapshot(q,(documents)=>{
            setFavoriteBoards(documents.docs);
        })
    }

    useEffect(()=>{
        getInvolvedBoards();
        getPublicBoards();
        getFavoriteBoards();
     },[loggedIn])

    return (
        <div className="w-[100vw - 2 rem] flex flex-col m-8">
            <p className="text-3xl font-semibold pb-5">Involved Boards</p>
            <div className="w-full flex flex-row overflow-x-scroll space-x-3 pb-5 mb-6">
                {InvolvedBoards.map((curr)=>{
                    return(
                        <Board board={curr}></Board>
                    );
                })}
                {InvolvedBoards.length==0 && (
                    <p>Empty</p>
                )}
            </div>

            <p className="text-3xl font-semibold pb-5">Public Boards</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-scroll space-x-3 pb-5 mb-6">
                {PublicBoards.map((curr)=>{
                    return(
                        <Board board={curr}></Board>
                    );
                })}
                {PublicBoards.length==0 && (
                    <p>Empty</p>
                )}
            </div>

            <p className="text-3xl font-semibold pb-5">Favorite Boards</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-scroll space-x-3 pb-5 mb-6">
                {FavoriteBoards.map((curr)=>{
                    return(
                        <Board board={curr}></Board>
                    );
                })}
                {FavoriteBoards.length==0 && (
                    <p>Empty</p>
                )}
            </div>
        </div>
    );
}
 
export default BoardTab;