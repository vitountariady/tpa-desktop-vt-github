import { ExclamationCircleIcon, MinusIcon, PlusCircleIcon, PlusIcon } from "@heroicons/react/solid";
import { addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import Label from "./Label";

const ManageLabel = (parameter) => {
    const [Labels, setLabels] = useState([]);
    const [ShowWarning, setShowWarning] = useState('');

    useEffect(() => {
        const q = query(collection(db,'labels'));
        onSnapshot(q,(snap)=>{
            setLabels(snap.docs);
        })
    }, [])
    
    const CreateLabel = () =>{
        let labelName = document.getElementById("labelName").value;
        let color = document.getElementById("color").value;
        console.log(color);
        if(labelName === ''){
            setShowWarning('Label Name cannot be Empty');
            return;
        }else{
            setShowWarning('');
            addDoc(collection(db,'labels'),{
                LabelName: labelName,
                color: color
            })
        }
    }

    const AttachLabel = (id) =>{
        console.log(id)
        updateDoc(doc(db,'card',parameter.card.id),{
            labels: arrayUnion(id)
        })
    }
    const DettachLabel = (id) =>{
        updateDoc(doc(db,'card',parameter.card.id),{
            labels: arrayRemove(id)
        })
    }

    return (
        <div className="z-20 bg-transparent fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div className="flex-col flex h-[30rem] w-[40rem] z-100 justify-start items-start p-5 rounded-lg bg-white overflow-y-scroll space-y-3">
                <p className="text-3xl font-semibold">Labels</p>
                {Labels.length===0 && (
                    <div className="flex items-center justify-center w-full h-[10rem] border-2 rounded-md">
                        <p>Empty</p>
                    </div>
                )}
                {Labels.length>0 && (
                    <div className="grid grid-cols-3 w-full min-h-[10rem] border-2">
                        {Labels.map((label)=>{
                            return(
                                <div className="h-fit w-[10rem] flex flex-row space-x-1 items-center">
                                    <Label label={label}></Label>
                                    {(!parameter.card.data().labels.includes(label.id))&&(
                                        <button onClick={()=>{AttachLabel(label.id)}} className="bg-blue-500 w-8 h-8 rounded-full text-white flex items-center justify-center">
                                            <PlusIcon className="w-4"></PlusIcon>
                                        </button>
                                    )}
                                    {(parameter.card.data().labels.includes(label.id))&&(
                                        <button onClick={()=>{DettachLabel(label.id)}} className="bg-red-500 w-8 h-8 rounded-full text-white flex items-center justify-center">
                                            <MinusIcon className="w-4"></MinusIcon>
                                        </button>
                                    )}
                                </div>
                            )
                         })}
                    </div>
                )}
                <p className="text-3xl font-semibold">Create Label</p>
                <input type="text" id="labelName" className="w-[20rem] border-2 border-gray-400 px-2 rounded-md" placeholder="Label Name" />
                <select name="color" id="color" className="border-2 border-gray-400 rounded-md p-1">
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                </select>
                <button onClick={CreateLabel} className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 items-center p-2 rounded-lg text-white">Create Label</button>
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
 
export default ManageLabel;