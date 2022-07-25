import { useEffect, useState } from "react";
import BoardTab from "../Components/boardTab";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import WorkspaceTab from "../Components/workspaceTab";
import { UserAuth } from "../context/AuthContext";

const HomePage = () => {
    const loggedIn = UserAuth();
    const [UserData, setUserData] = useState('user');
    const [Selected, setSelected] = useState('workspace');
    useEffect(()=>{
        // getWorkspaceList();
        setUserData(loggedIn.userData);
     },[loggedIn])

     useEffect(()=>{
        let boardbutton = document.getElementById("boardbutton");
        let workspacebutton = document.getElementById("workspacebutton");
        if(Selected==='board'){
            boardbutton.classList.add("bg-blue-900");
            workspacebutton.classList.remove("bg-blue-900");
        }else if(Selected === 'workspace'){
            boardbutton.classList.remove("bg-blue-900");
            workspacebutton.classList.add("bg-blue-900");
        }
     },[Selected])

     const openBoardTab = () =>{
        setSelected("board");
     }
     
     const openWorkspaceTab = () =>{
        setSelected("workspace");
     }

    return ( 
        <div>
            <Navbar></Navbar>
            <div className="flex flex-col pt-16  h-screen w-full">
                <p className="text-black text-4xl m-8 font-bold">Welcome, {UserData.FirstName} {UserData.LastName}</p>
                <div className="ml-8 space-x-2">
                    <button onClick={openWorkspaceTab} id="workspacebutton" className="w-28 h-10 rounded-md bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white">Workspaces</button>
                    <button onClick={openBoardTab} id="boardbutton" className="w-28 h-10 rounded-md bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white">Boards</button>
                </div>
                {Selected === "workspace" && (
                    <WorkspaceTab></WorkspaceTab>
                )}
                {Selected === "board" && (
                    <BoardTab></BoardTab>
                )}
            </div>
        </div>
    );
}
 
export default HomePage;