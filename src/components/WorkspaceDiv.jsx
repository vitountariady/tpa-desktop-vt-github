import { Cog } from "heroicons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import WorkspaceSetting from "./workspaceSettingModal";
const WorkspaceDiv = (props) => {
    const [settingModal, setSettingModal] = useState(false);

    function ToggleSetting(){
        setSettingModal(!settingModal);
    }

    return (
        <div className="flex flex-row h-25">
            <Link to={"/"+props.id} className="w-[80%] p-2 h-25 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-md flex justify-start items-center">
                <p className="text-white">{props.content}</p>
            </Link>
            <div className="bg-gray-700 hover:bg-gray-600 h-15 w-10 active:bg-gray-800 rounded-lg flex justify-center items-center"onClick={ToggleSetting}>
                <Cog  className=" fill-white"></Cog>
            </div>
            {settingModal&& 
                <WorkspaceSetting key={props.id} workspaceid={props.id} close={ToggleSetting}></WorkspaceSetting>
            }
        </div>
    );
}
 
export default WorkspaceDiv;