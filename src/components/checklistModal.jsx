import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.config";

const ChecklistModal = (props) => {
    function AddCheckList(e){
        e.preventDefault();
        const ChecklistName = e.target.name.value;
        addDoc(collection(db,'workspace',props.workspaceid,'board',props.boardid,'list',props.listid, 'card',props.cardid, 'checklist'),{
           ChecklistName: ChecklistName,
           Done: false
        }).catch((error)=>{
            console.log("ga masuk");
        });
        props.close();
    }

    return ( 
        <div className="w-64 h-fit flex justify-center p-5 rounded-lg border-2 bg-blue-200 border-black">
            <form className="flex flex-col items-center space-y-3" onSubmit={AddCheckList}>
                <input type="text" name="name" className="rounded-lg p-1 border-2 border-black"/>
                <button type="submit" className="border-2 border-black bg-gray-200 rounded-lg p-1">Create Checklist</button>
            </form>
        </div>
     );
}
 
export default ChecklistModal;