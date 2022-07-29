import { TrashIcon } from "@heroicons/react/outline";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import Task from "./Task";

const Checklist = (parameter) => {
    const [Tasks, setTasks] = useState([]);
    useEffect(() => {
        const q = query(collection(db,'card',parameter.card.id,'checklist',parameter.checklist.id,'tasks'))
        onSnapshot(q,((snap)=>{
            setTasks(snap.docs);
        }))
    }, [])

    const deleteCheckList = () =>{
        deleteDoc(doc(db,'card',parameter.card.id,'checklist',parameter.checklist.id))
    }

    const changeChecklistName = (e) =>{
        if(e.key === 'Enter'){
            if(e.target.value===''){
                return;
            }
            updateDoc(doc(db,'card',parameter.card.id,'checklist',parameter.checklist.id),{
                checklistName: e.target.value
            })
        }
    }
    
    const addTask=()=>{
        addDoc(collection(db,'card',parameter.card.id,'checklist',parameter.checklist.id,'tasks'),{
            taskName: "New Task",
            done:false
        })
    }

    return (
        <div className="w-72 h-fit p-3 rounded-lg bg-slate-600 flex flex-col space-y-2">
            <div className="w-full h-full border-slate-700 flex flex-row rounded-lg border-2">
                <input onKeyDown={changeChecklistName} type="text" className="w-64 px-2 p-1 rounded-l-lg" defaultValue={parameter.checklist.data().checklistName} />
                <div onClick={deleteCheckList} className="w-8 bg-red-500 hover:bg-red-400 active:bg-red-600 rounded-r-lg flex items-center justify-center">
                    <TrashIcon className="w-6 h-6 stroke-white hover:stroke-gray-200 active:stroke-gray-400"></TrashIcon>
                </div>
            </div>
            {Tasks.map((task)=>{
                return(
                    <Task task={task} card={parameter.card} checklist={parameter.checklist}></Task>
                    )
                })}
            <div onClick={addTask} className="w-full flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 rounded-md text-white">Add Task</div>
        </div>
    );
}
 
export default Checklist;