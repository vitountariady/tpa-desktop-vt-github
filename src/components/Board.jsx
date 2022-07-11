import { CogIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import BoardSetting from "./BoardSettingModal";

const Board = (parameter) => {
    const [IsMember, setIsMember] = useState(false);
    const [Modal, setModal] = useState(false);
    const LoggedIn = UserAuth();

    useEffect(() => {
        if(parameter.board.data().members.includes(LoggedIn.user.uid)){
            setIsMember(true);
        }
    }, [parameter.board])

    const toggleModal = () =>{
        setModal(!Modal);
    }

    useEffect(() => {
        if(Modal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [Modal])

    if(!IsMember && !parameter.board.data().Public){
        return;
    }

    return (
        <div className='m-5 w-56 h-40'>
            <div className="rounded-t-lg bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 flex flex-col justify-center items-center h-[80%]">
                <p className="text-xl font-bold">{parameter.board.data().BoardName}</p>
                <p>{parameter.board.data().Description}</p>
            </div>
            <div onClick={toggleModal} className="bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 h-[20%] w-[100%] rounded-b-lg flex justify-center items-center">
                <CogIcon  className="h-6 w-6 fill-black"></CogIcon>
            </div>
            {Modal && <BoardSetting toggle={toggleModal} board= {parameter.board}></BoardSetting>}
        </div>
    );
}
 
export default Board;