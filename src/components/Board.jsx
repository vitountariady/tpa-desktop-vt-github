import { CogIcon, HeartIcon } from "@heroicons/react/solid";
import { arrayRemove, arrayUnion, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import BoardSetting from "./BoardSettingModal";

const Board = (parameter) => {
    const [IsMember, setIsMember] = useState(false);
    const [Modal, setModal] = useState(false);
    const [IsFavorite, setIsFavorite] = useState(false);
    const loggedIn = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(parameter.board.data().members.includes(loggedIn.user.uid)){
            setIsMember(true);
        }
    }, [parameter.board])

    const toggleModal = () =>{
        setModal(!Modal);
    }

    const addToFavorite =()=>{
        updateDoc(doc(db,'board',parameter.board.id),{
            Favorite: arrayUnion(loggedIn.user.uid)
        })
    }
    
    const removeFavorite =()=>{
        updateDoc(doc(db,'board',parameter.board.id),{
            Favorite: arrayRemove(loggedIn.user.uid)
        })
    }

    const handleFavorite = ()=>{
        if(IsFavorite){
            removeFavorite();
        }else{
            addToFavorite();
        }
    }

    useEffect (()=>{
        const q = query(doc(db,'board',parameter.board.id));
        onSnapshot(q,(document)=>{
            const Fav = document.data().Favorite;
            if(Fav!=null  ){
                if(Fav.includes(loggedIn.user.uid)){
                    setIsFavorite(true);
                }else{
                    setIsFavorite(false);
                }
            }
        })
    },[])

    useEffect(() => {
        if(Modal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [Modal])

    if(!IsMember && parameter.board.data().Public==="boardmember"){
        return;
    }

    return (
        <div className='w-56 h-40'>
            <Link to = {'/board/'+parameter.board.id}>
                <div className="rounded-t-lg bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 flex flex-col justify-center items-center h-[80%]">
                    <p className="text-xl font-bold">{parameter.board.data().BoardName}</p>
                    <p>{parameter.board.data().Description}</p>
                </div>
            </Link>
            <div className="bg-neutral-300 h-[20%] w-[100%] rounded-b-lg flex justify-center items-center">
                    <div onClick={toggleModal}  className="w-[50%] h-full hover:bg-neutral-200 active:bg-neutral-400 rounded-bl-lg flex justify-center items-center">
                        <CogIcon className="h-6 w-6 fill-black"></CogIcon>
                    </div>
                    <div onClick={handleFavorite} className="w-[50%] h-full hover:bg-neutral-200 active:bg-neutral-400 rounded-br-md flex justify-center items-center">
                        {!IsFavorite && (
                            <HeartIcon id="heart" className="h-6 w-6 fill-transparent stroke-black"></HeartIcon>
                        )}
                        {IsFavorite && (
                            <HeartIcon id="heart" className="h-6 w-6 fill-transparent stroke-black fill-red-700"></HeartIcon>
                        )}
                    </div>
                </div>
                {Modal && <BoardSetting toggle={toggleModal} board= {parameter.board}></BoardSetting>}
        </div>
    );
}
 
export default Board;