import { Cog } from "heroicons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import WorkspaceSettingModal from "./WorkspaceSettingModal";

const Workspace = (parameter) => {
    const loggedIn = UserAuth();
    const [Modal, setModal] = useState(false);

    const toggleModal = ()=>{
        setModal(!Modal);
    }

    useEffect(() => {
        if(Modal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [Modal])

    if(!parameter.workspace.data().members.includes(loggedIn.user.uid) && !parameter.workspace.data().Public){
        return;
    }

    return ( 
        <div key={parameter.workspace.data().id}className="flex flex-row h-25">
            <Link to={"/"+parameter.workspace.id} className="w-[80%] p-2 h-25 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md flex justify-start items-center">
                <p className="text-white">{parameter.workspace.data().WorkspaceName}</p>
            </Link>
            <div onClick={toggleModal} className="bg-gray-700 hover:bg-gray-600 h-15 w-10 active:bg-gray-800 rounded-lg flex justify-center items-center">
                <Cog  className=" fill-white"></Cog>
            </div>
            {Modal && <WorkspaceSettingModal workspace = {parameter.workspace} toggle={toggleModal}></WorkspaceSettingModal>}
        </div>
     );
}
 
export default Workspace;