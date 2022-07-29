import { isAdmin } from "@firebase/util";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ExclamationCircle } from "heroicons-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import Admin from "./Admin";
import BoardInviteModal from "./BoardInviteModal";
import Member from "./Member";

const BoardSetting = (parameter) => {
    const navigate = useNavigate();
    const LoggedIn = UserAuth();
    const [IsAdmin, setIsAdmin] = useState(false);
    const [IsOnlyAdmin, setIsOnlyAdmin] = useState(false);
    const [Members, setMembers] = useState([]);
    const [Admins, setAdmins] = useState([]);
    const [Open, setOpen] = useState('');
    const [Visibility, setVisibility] = useState('');
    const [ShowWarning, setShowWarning] = useState('');
    const [InviteModal, setInviteModal] = useState(false);

    const toggleInviteModal = () =>{
        setInviteModal(!InviteModal);
    }

    useEffect(()=>{
        setMembers(parameter.board.data().members);
        setAdmins(parameter.board.data().admins);
        if(parameter.board.data().admins.includes(LoggedIn.user.uid)){
            setIsAdmin(true);
            if(parameter.board.data().admins.length===1){
                setIsOnlyAdmin(true);
            }
        }else{
            setIsAdmin(false);
            setIsOnlyAdmin(false);
        }
        setVisibility(parameter.board.data().Public);
    },[parameter.board])

    const applyDelete = () =>{
        updateDoc(doc(db,'board', parameter.board.id),{
            remove: [LoggedIn.user.uid]
        });
        Admins.forEach((Admin)=>{
            if(!self(Admin)){
                updateDoc(doc(db,'notifications',Admin),{
                    boarddelete:arrayUnion(parameter.board.id)
                })
            }
        })
        console.log("dah ke apply")
    }

    const deleteBoard = () =>{
        deleteDoc(doc(db,'board',parameter.board.id));
        parameter.toggle();
    }

    const demoteAdmin = (id) =>{
        updateDoc(doc(db,'board', parameter.board.id),{
            admins: arrayRemove(id)
        });
    }

    const promoteMember = (id) =>{
        updateDoc(doc(db,'board', parameter.board.id),{
            admins: arrayUnion(id)
        });
    }

    const removeMember = (id)=>{
        if(Members.length===1){
            deleteBoard();
        }else if(self(id)&&IsAdmin&&IsOnlyAdmin){
            setShowWarning('Please Assign Admin Role to Another Member');
            return;
        }else{
            updateDoc(doc(db,'board', parameter.board.id),{
                members: arrayRemove(id),
                admins: arrayRemove(id)
            });
        }
    }
    
    const self = (id) =>{
        if(id === LoggedIn.user.uid){
            return true;
        }
        return false;
    }

    const changeVisibility=()=>[
        updateDoc(doc(db,'board',parameter.board.id),{
            Public: document.getElementById("public").value
        })
    ]
    
    const toggleOpen = () =>{
        updateDoc(doc(db,'board',parameter.board.id),{
            Open: false
        })
        parameter.toggle()
    }


    return(
        <div style={{background:'rgba(0,0,0,0.5)'}} className="fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
        <div className="flex-col h-[30rem] w-[40rem] text-center z-100 items-center rounded-lg bg-white overflow-y-scroll">
            <div className="w-full h-[5rem] flex rounded-t-lg justify-start items-center bg-white p-5 sticky top-0">
                <p className="text-3xl font-bold">{parameter.board.data().BoardName}</p>
            </div>
            <div className="m-1 h-fit w-[20rem] flex flex-col justify-center items-start p-5 space-y-3">
                <p className="text-2xl">Members</p>                     
                {Admins.map((admin)=>{
                    return(
                        <Admin key={admin} IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} admin={admin} demoteAdmin={demoteAdmin} removeMember={removeMember}></Admin> 
                    )
                })}
                {Members.map((member)=>{
                         if(!Admins.includes(member)){
                             return(<Member key={member} IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} member={member} promoteMember={promoteMember} removeMember={removeMember}></Member>);
                        }
                })}

                {IsAdmin && (
                        <button onClick={toggleInviteModal} className="h-10 pl-3 rounded-lg w-[18rem] bg-blue-500  hover:bg-blue-600 active:bg-blue-700 text-white">Invite User to Board</button>
                        )}
                 {InviteModal && (
                        <BoardInviteModal toggle={toggleInviteModal} board ={parameter.board}></BoardInviteModal>
                    )}

                {IsAdmin && (
                        <p className="text-2xl">Visibility</p>
                )}
                {IsAdmin && (
                     <div className="flex-col items-start space-y-2">
                        <select onClick={changeVisibility} name="public" id="public" defaultValue={Visibility}>
                            <option id="boardmemberonly" value="boardmember">Board Member Only</option>
                            <option id="workspacememberonly" value="workspacemember">Workspace Member Only</option>
                            <option id="publiconly" value="public">Public</option>
                        </select>
                    </div>
                )}
                    
                {IsAdmin && (
                    <button onClick={toggleOpen} id="openButton" className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white" >
                        Close Board
                    </button>
                )}

                {IsAdmin && (
                    <button onClick={applyDelete} className="w-[18rem] h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Delete Board
                    </button>
                )}

                {ShowWarning!=='' && (
                    <div className="w-fit absolute top-1 left-[50%] translate-x-[-50%] py-2 px-4 h-fit bg-red-500 rounded-lg flex flex-row items-center justify-center space-x-2">
                        <ExclamationCircle className="fill-white"></ExclamationCircle>
                        <p className="text-white text-sm">{ShowWarning}</p>
                    </div>
                )}
            </div>
            <div className="w-[38rem] pb-5 bottom-0 flex flex-row-reverse">
                <button
                    onClick={parameter.toggle}
                    className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Cancel
                </button>
            </div>
        </div>      
    </div>
    );
}
export default BoardSetting;