import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase.config";

const LabelSetting = (parameter) => {
    const [ShowWarning, setShowWarning] = useState('')

    const deleteLabel = () =>{
        deleteDoc(doc(db,'labels',parameter.label.id));
        parameter.toggle();
    }

    const updateLabel = () =>{
        let labelName = document.getElementById("labelName").value;
        let color = document.getElementById("color").value;
        if(labelName===''){
            setShowWarning('Label Name cannot be Empty');
            return;
        }else{
            setShowWarning('');
            updateDoc(doc(db,'labels',parameter.label.id),{
                LabelName : labelName,
                color: color
            });
            parameter.toggle();
        }
    }
    return (
        <div className="z-20 bg-transparent fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div className="flex-col flex h-[30rem] w-[40rem] z-100 justify-start items-start p-5 rounded-lg bg-white overflow-y-scroll space-y-3">
                <p className="text-3xl font-semibold">Label Setting</p>
                <p className="text-lg">Label Name</p>
                <input type="text" id="labelName" className="w-[20rem] border-2 border-gray-400 px-2 rounded-md" placeholder="Label Name" defaultValue={parameter.label.data().LabelName}/>
                <p className="text-lg">Label Color</p>
                <select name="color" id="color" className="border-2 border-gray-400 rounded-md p-1" defaultValue={parameter.label.data().color}>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                </select>
                <button onClick={updateLabel} className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 items-center p-2 rounded-lg text-white">Update Label</button>
                <button onClick={deleteLabel} className="bg-red-500 hover:bg-red-400 active:bg-red-600 items-center p-2 rounded-lg text-white">Delete Label</button>
                <button
                    onClick={parameter.toggle}
                    className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Cancel
                </button>
            </div>
            {ShowWarning!=='' && (
                    <div className="w-fit absolute top-1 left-[50%] translate-x-[-50%] py-2 px-4 h-fit bg-red-500 rounded-lg flex flex-row items-center justify-center space-x-2">
                        <ExclamationCircleIcon className="fill-white w-5"></ExclamationCircleIcon>
                        <p className="text-white text-sm">{ShowWarning}</p>
                    </div>
                )}
        </div>
    );
}
 
export default LabelSetting;