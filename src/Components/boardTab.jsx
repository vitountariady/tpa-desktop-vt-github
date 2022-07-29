import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import Board from "./Board";

const BoardTab = () => {
    const loggedIn = UserAuth();
    const [InvolvedBoards, setInvolvedBoards] = useState([]);
    const [PublicBoards, setPublicBoards] = useState([]);
    const [FavoriteBoards, setFavoriteBoards] = useState([]);
    const [searchQuery, setsearchQuery] = useState('');

    var involvedcount = 0;
    var favcount = 0;
    var publiccount = 0;

    useEffect(()=>{
        involvedcount = 0;
        favcount = 0;
        publiccount = 0;
    },[searchQuery])

    const deleteBoard = (id) =>{
        deleteDoc(doc(db,'board',id));
    }

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
            <input id="searchbar" type="text" placeholder="Search" className="border-gray-400 border-2 p-1 rounded-md mb-5" onChange={()=>{setsearchQuery(document.getElementById("searchbar").value)}} />
            <p className="text-3xl font-semibold pb-5">Involved Boards</p>
            <div className="w-full flex flex-row overflow-x-auto space-x-3 pb-5 mb-6">
                {InvolvedBoards.map((curr)=>{
                    if(curr.data().remove.length === curr.data().admins.length){
                        deleteBoard(curr.id);
                    }
                    let name = curr.data().BoardName;
                    if(name.toLowerCase().includes(searchQuery.toLowerCase()) && curr.data().Open ){
                        involvedcount++;
                        return(
                            <Board key={curr.id} board={curr}></Board>
                        );
                    }
                })}
                {(InvolvedBoards.length ===0 || involvedcount===0) && (
                    <p className="text-xl">Empty</p>
                )}
            </div>

            <p className="text-3xl font-semibold pb-5">Public Boards</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-auto space-x-3 pb-5 mb-6">
                {PublicBoards.map((curr)=>{
                    if(curr.data().remove.length === curr.data().admins.length){
                        deleteBoard(curr.id);
                    }
                    let name = curr.data().BoardName;
                    if(name.toLowerCase().includes(searchQuery.toLowerCase()) && curr.data().Open){
                        publiccount++;
                        return(
                            <Board key={curr.id} board={curr}></Board>
                        );
                    }
                })}
                {(PublicBoards.length===0 || publiccount===0)&& (
                    <p className="text-xl">Empty</p>
                )}
            </div>

            <p className="text-3xl font-semibold pb-5">Favorite Boards</p>
            <div className="w-full min-h-[10rem] flex flex-row overflow-x-auto space-x-3 pb-5 mb-6">
                {FavoriteBoards.map((curr)=>{
                    if(curr.data().remove.length === curr.data().admins.length){
                        deleteBoard(curr.id);
                    }
                    let name = curr.data().BoardName;
                    if(name.toLowerCase().includes(searchQuery.toLowerCase()) && curr.data().Open){
                        favcount++;
                        return(
                            <Board key={curr.id} board={curr}></Board>
                        );
                    }
                })}
                {(FavoriteBoards.length===0 || favcount===0) && (
                    <p className="text-xl">Empty</p>
                )}
            </div>
        </div>
    );
}
 
export default BoardTab;