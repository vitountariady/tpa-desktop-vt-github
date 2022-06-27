import { addDoc, collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";

const Checklist = (props) => {
    const[tasks,settask]=useState([]);

    const updateTaskName =(e, taskid)=>{
        if(e.key === 'Enter'){
            updateDoc(doc(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.listid,'card',props.cardid, 'checklist', props.checklist.id,'task',taskid),{
                TaskName: e.target.value
            });
        }
    }

    const checkTask =(e,taskid)=>{
        updateDoc(doc(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.listid,'card',props.cardid, 'checklist', props.checklist.id,'task',taskid),{
            Done: e.target.checked
        });
    }

    useEffect(()=>{
        const q = query(collection(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.listid,'card',props.cardid, 'checklist', props.checklist.id,'task'));
        onSnapshot(q,(docs)=>{
            if(docs){
            let array=[];
            docs.forEach(doc=>{
                // console.log(doc.data());
                array.push({...doc.data(), id:doc.id});
            });
            settask(array);
            }
            else{
                settask([]);
            }
        });
    },[]);

    function addTask(){
        addDoc(collection(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.listid,'card', props.cardid,'checklist',props.checklist.id,'task'),{
            TaskName: "New Task",
            Done:false
        });
    } 

    return ( 
        <div className="p-5 rounded-lg bg-gray-200 m-7 w-[25rem] h-fit flex flex-col items-center space-y-5">
                <p className="text-2xl">{props.checklist.ChecklistName}</p>
                    {tasks.map((task)=>{
                        return(
                            <div className="bg-gray-400 w-[20rem] p-2 rounded-lg h-10 flex flex-row justify-start items-center space-x-10">
                                <div className="h-full w-[80%]">
                                    <input className="bg-gray-400 w-full pl-2 rounded-lg text-white focus:outline-none focus:bg-gray-200 focus:text-black " type="text" defaultValue={task.TaskName} onKeyDown={(e)=>{updateTaskName(e,task.id)}}/>
                                </div>
                                    <input type="checkbox" className="h-5 w-5" defaultChecked={task.Done} name="taskdone" onClick={(e)=>{checkTask(e,task.id)}}/>
                            </div>
                        );
                    })}
            <button onClick={addTask} className="p-3 w-[20rem] text-md bg-gray-500 hover:bg-gray-400 active:text-black active:bg-gray-300 text-white rounded-lg">Add Task</button>
        </div>
     );
}
 
export default Checklist;