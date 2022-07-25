import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import Admin from "./Admin";
import Member from "./Member";

const BoardSetting = (parameter) => {
    const navigate = useNavigate();
    const LoggedIn = UserAuth();
    const [IsAdmin, setIsAdmin] = useState(false);
    const [IsOnlyAdmin, setIsOnlyAdmin] = useState(false);
    const [Members, setMembers] = useState([]);
    const [link, setLink] = useState('');
    const [Admins, setAdmins] = useState([]);
    const [Open, setOpen] = useState('');
    const [Visibility, setVisibility] = useState('');

    useEffect(()=>{
        setMembers(parameter.board.data().members);
        setAdmins(parameter.board.data().admins);
        if(parameter.board.data().admins.includes(LoggedIn.user.uid)){
            setIsAdmin(true);
            if(parameter.board.data().admins.length===1){
                setIsOnlyAdmin(true);
            }
        }
        setVisibility(parameter.board.data().Public);
    },[parameter.board])

    useEffect(()=>{
        if(IsAdmin===false){
            return;
        }
        let openButton = document.getElementById("openButton");
        if(parameter.board.data().Open){
            openButton.classList.add("bg-green-500", "hover:bg-green-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-green-500");
            openButton.classList.remove("bg-red-500", "hover:bg-red-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-red-500");
            setOpen('Open')
        }else{
            openButton.classList.add("bg-red-500", "hover:bg-red-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-red-500");
            openButton.classList.remove("bg-green-500", "hover:bg-green-600", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2","focus:ring-green-500");
            setOpen('Close')
        }
    },[parameter.board.data()])

    const makeLink = async ()=>{
        setDoc(doc(db,'boardInvite',parameter.board.id),{
            timestamp: serverTimestamp(),
            boardID: parameter.board.id
        })
        setLink("localhost:3000/boardinvite/"+parameter.board.id)
    }

    const getLink =()=>{
        const q = query(doc(db,'boardInvite',parameter.board.id));
        getDoc(q).then((doc)=>{
            if(doc.data()===undefined){
                makeLink();
            }else{
                setLink("localhost:3000/boardinvite/"+doc.id)
            }
        })
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
            Open: !parameter.board.data().Open
        })
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
                        <Admin IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} admin={admin} demoteAdmin={demoteAdmin} removeMember={removeMember}></Admin> 
                    )
                })}
                {Members.map((member)=>{
                         if(Admins.includes(member)){
                            return;
                        }
                        return(<Member IsOnlyAdmin={IsOnlyAdmin} IsAdmin={IsAdmin} self={self} member={member} promoteMember={promoteMember} removeMember={removeMember}></Member>);
                })}

                {IsAdmin && (
                        <button onClick={getLink} className="h-10 pl-3 rounded-lg w-[18rem] bg-blue-500  hover:bg-blue-600 active:bg-blue-700 text-white">Generate Invite Link</button>
                        )}
                    <p>{link}</p>

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
                        <p className="text-2xl">Open</p>
                )}
                    
                {IsAdmin && (
                        <button onClick={toggleOpen} id="openButton" className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white">
                        {Open}
                    </button>
                )}

                {IsAdmin && (
                    <button onClick={deleteBoard} className="w-[18rem] h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Delete Board
                    </button>
                )}
            </div>
            <div className="w-[38rem] pb-5 sticky bottom-0 flex flex-row-reverse">
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