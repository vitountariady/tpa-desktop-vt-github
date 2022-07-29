import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const Task = (parameter) => {
    const changeTaskName = (e) =>{
        if(e.key === 'Enter'){
            if(e.target.value===''){
                return;
            }
            updateDoc(doc(db,'card',parameter.card.id,'checklist',parameter.checklist.id,'tasks',parameter.task.id),{
                taskName: e.target.value
            })
        }
    }

    const changeDone = () =>{
        updateDoc(doc(db,'card',parameter.card.id,'checklist',parameter.checklist.id,'tasks',parameter.task.id),{
            done: !parameter.task.data().done
        })
    }

    const deleteTask = () =>{
        deleteDoc(doc(db,'card',parameter.card.id,'checklist',parameter.checklist.id,'tasks',parameter.task.id));
    }

    return (
        <div className=" h-10 flex flex-row justify-between p-2 rounded-lg bg-gray-700">
            <div className="flex flex-row">
                <input onKeyDown={(e)=>{changeTaskName(e)}} className="rounded-l-md px-2 w-40" type="text" defaultValue={parameter.task.data().taskName}/>
                <button onClick={deleteTask} className="items-center jusitfy-center flex text-sm p-2 rounded-r-md bg-red-500 hover:bg-red-400 active:bg-red-600 text-white">Delete</button>
            </div>
            <input onClick={changeDone} className="w-4" type="checkbox" defaultChecked={parameter.task.data().done}/>
        </div>
    );
}
 
export default Task;