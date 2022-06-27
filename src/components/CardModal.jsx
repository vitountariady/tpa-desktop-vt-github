import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import Checklist from "./checklist";
import ChecklistModal from "./checklistModal";

const CardModal = (props) => {
    const [checklistModal, setChecklistModal] = useState(false);
    const[checklists,setchecklist]=useState([]);

    useEffect(()=>{
        const q = query(collection(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.listid,'card',props.card.id, 'checklist'));
        onSnapshot(q,(docs)=>{
            if(docs){
            let array=[];
            docs.forEach(doc=>{
                // console.log(doc.data());
                array.push({...doc.data(), id:doc.id});
            });
            setchecklist(array);
            }
            else{
                setchecklist([]);
            }
        });
    },[]);

    function ToggleChecklistModal(){
        setChecklistModal(!checklistModal);
    }

    function UpdateDescription(e){
        if(e.key === 'Enter'){
            updateDoc(doc(db,'workspace',props.workspaceid, 'board' , props.boardid, 'list' , props.listid ,'card',props.card.id),{
                CardDescription: e.target.value
            })
        }
    }

    return ( 
    <div style={{background:'rgba(0,0,0,0.5)'}} className="z-20 left-0 top-0 fixed flex w-full min-h-full justify-center items-center">
        <div className="h-[30rem] w-[45rem] bg-white rounded-lg overflow-y-auto">
            <div className="flex items-center bg-white sticky top-0 mb-2">
                <p className="m-6 ml-7 text-4xl">{props.card.CardTitle}</p>
            </div>
            <div className="flex flex-row w-full h-[10rem] justify-evenly items-center">
                <textarea onKeyDown={(e)=>{UpdateDescription(e)}} name="description" id="" cols="30" rows="10" placeholder="Card Description" className="p-3 m-5 resize-none w-[25rem] h-[10rem] rounded-lg border-2 border-black" defaultValue={props.card.CardDescription}></textarea>
                <div className="w-[16rem] h-[10rem] flex flex-col space-y-5 items-center">
                    <button onClick={ToggleChecklistModal} className="w-[12rem] min-h-[3rem] bg-gray-300 hover:bg-gray-200 active:bg-gray-400 active:text-white rounded-lg flex justify-center items-center">
                        Add Checklist
                    </button>
                    <button onClick={props.close} className="text-white w-[12rem] min-h-[3rem] bg-red-500 hover:bg-red-400 active:bg-red-600 rounded-lg flex justify-center items-center">
                        Close
                    </button>
                    {checklistModal&&(
                        <ChecklistModal close={ToggleChecklistModal} workspaceid={props.workspaceid} boardid={props.boardid} listid={props.listid} cardid={props.card.id}></ChecklistModal>
                    )}
                </div>
            </div>
            {
                checklists.map((checklist)=>{
                    console.log(checklist);
                    return(
                    <Checklist workspaceid={props.workspaceid} boardid={props.boardid} listid={props.listid} cardid={props.card.id} checklist={checklist}></Checklist>
                    );
                })}
        </div>
    </div>
    );
}
 
export default CardModal;