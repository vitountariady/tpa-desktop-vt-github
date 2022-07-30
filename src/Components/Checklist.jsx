import { TrashIcon } from "@heroicons/react/outline";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import Task from "./Task";

const Checklist = (parameter) => {
    const [Tasks, setTasks] = useState([]);
    const [Progress, setProgress] = useState(0);
    const [NotDone, setNotDone] = useState(100);

    useEffect(() => {
        const q = query(collection(db,'card',parameter.card.id,'checklist',parameter.checklist.id,'tasks'))
        onSnapshot(q,((snap)=>{
            setTasks(snap.docs);
        }))
    }, [parameter])

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

    useEffect(()=>{
        const q=query(collection(db,'card',parameter.card.id,'checklist',parameter.checklist.id,'tasks'),where('done','==',true))
        onSnapshot(q,(snap)=>{
            let totalTask = Tasks.length;
            let done = snap.docs.length;
            // console.log(Math.ceil((done/totalTask)*100))
            // console.log(Math.floor(100-((done/totalTask)*100)))
            setProgress(Math.ceil((done/totalTask)*100));
            setNotDone(Math.floor(100-((done/totalTask)*100)));
        })
    }, [Tasks])

    return (
        <div className="w-72 h-fit p-3 rounded-lg bg-slate-600 flex flex-col space-y-2">
            <div className="w-full h-full border-slate-700 flex flex-row rounded-lg border-2">
                <input onKeyDown={changeChecklistName} type="text" className="w-64 px-2 p-1 rounded-l-lg" defaultValue={parameter.checklist.data().checklistName} />
                <div onClick={deleteCheckList} className="w-8 bg-red-500 hover:bg-red-400 active:bg-red-600 rounded-r-lg flex items-center justify-center">
                    <TrashIcon className="w-6 h-6 stroke-white hover:stroke-gray-200 active:stroke-gray-400"></TrashIcon>
                </div>
            </div>
            <div className="w-full m-1 h-5 flex flex-row items-center justify-start">
                <div style={{width: Progress*2}} className="h-full bg-yellow-400"></div>
                <div style={{width: NotDone*2}} className="h-full bg-white"></div>
            </div>
            {Tasks.map((task)=>{
                return(
                    <Task key={task.id} task={task} card={parameter.card} checklist={parameter.checklist}></Task>
                )
            })}
            <div onClick={addTask} className="w-full flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 rounded-md text-white">Add Task</div>
        </div>
    );
}
 
export default Checklist;