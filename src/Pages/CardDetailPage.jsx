import {useQuill} from "react-quilljs";
import 'quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase.config";
import Checklist from "../Components/Checklist";
import Comments from "../Components/Comments";
import ManageLabel from "../Components/ManageLabelModal";
import Label from "../Components/Label";
import CardAttachment from "../Components/CardAttachment";
import CardLocation from "../Components/CardLocation";
const CardDetail = (parameter) => {
    const modules ={
        toolbar: [["bold", "italic", "underline", "strike"]]
    }

    const {quill, quillRef} = useQuill({modules})
    const [Checklists, setChecklists] = useState([]);
    const [Labels, setLabels] = useState([]);
    const [LabelModal, setLabelModal] = useState(false);

    useEffect(() => {
        if(quill){
            quill.clipboard.dangerouslyPasteHTML(
                parameter.card.data().CardDescription
            )
        }
    },[quill])

    const addChecklist = () =>{
        addDoc(collection(db, 'card',parameter.card.id,'checklist'),{
            checklistName: "New Checklist",
            done: false
        })
    }

    const addDueDate = () =>{
        updateDoc(doc(db,'card', parameter.card.id),{
            duedate: document.getElementById('duedate').value
        })
    }

    useEffect(()=>{
        const q = query(collection(db, 'card',parameter.card.id,'checklist'))
        onSnapshot(q,(snap)=>{
            setChecklists(snap.docs);
        })
    },[])

    useEffect (()=>{
        document.getElementById("duedate").value = parameter.card.data().duedate
    },[])

    useEffect(()=>{
        const q = query(collection(db,'labels'));
        onSnapshot(q,(snap)=>{
            let arr=[]
            snap.forEach((label)=>{
                if(parameter.card.data().labels.includes(label.id)){
                    arr.push(label);
                }
            })
            setLabels(arr);
        })
    },[parameter])

    useEffect(()=>{
        if(quill){
            quill.on('text-change',(e)=>{
                if(e.ops[1].insert && e.ops[1].insert === "\n"){
                    updateDoc(doc(db,'card',parameter.card.id),{
                        CardDescription: quill.root.innerHTML
                    })
                }
            })
        }
    },[quill])

    const toggleLabelModal = () =>{
        setLabelModal(!LabelModal);
    }


    return (
        <div  style={{background:'rgba(0,0,0,0.5)'}} className="z-10 fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            {LabelModal && (
                <ManageLabel toggle={toggleLabelModal} card={parameter.card}></ManageLabel>
            )}
            <div className="flex-col h-[30rem] w-[40rem] z-100 justify-start items-center p-5 rounded-lg bg-white overflow-y-scroll space-y-3">
                <div className="w-full flex flex-row justify-between items-start">
                    <p className="text-3xl font-bold">{parameter.card.data().CardName}</p>
                    <button onClick={toggleLabelModal} className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 items-center p-2 rounded-lg text-white">Manage Label</button>
                </div>
                <div className="grid grid-cols-6 w-full h-fit border-2">
                    {Labels.map((label)=>{
                        return(
                            <Label label={label}></Label>
                        )
                    })}
                </div>
                <p className="text-xl font-semibold">Card Description</p>
                <div className="w-full h-32">
                    <div ref={quillRef}></div>
                </div>

                <p className="pt-10 text-xl font-semibold">Checklist</p>
                <button onClick={addChecklist} className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 items-center p-2 rounded-lg text-white">Add Checklist</button>
                {Checklists.map((check)=>{
                    return(
                        <Checklist key={check.id} card={parameter.card} checklist={check}></Checklist>
                        )
                    })}
                <p className="pt-10 text-xl font-semibold">Comments</p>
                <Comments card={parameter.card}></Comments>
                
                <p className="pt-10 text-xl font-semibold">Due Date</p>
                <div className="flex-row flex">
                    <input className="border-2 border-gray-500 px-2 rounded-l-md" type="date" name="duedate" id="duedate" defaultValue={parameter.card.data().duedate} />
                    <button onClick={addDueDate} className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 items-center p-2 rounded-r-md text-white">Set Due Date</button>
                </div>
                
                <p className="pt-10 text-xl font-semibold">Attachment</p>
                <CardAttachment card={parameter.card}></CardAttachment>

                <CardLocation card={parameter.card}></CardLocation>

                <div className="w-[36rem] pb-5 bottom-0 flex flex-row-reverse">
                <button
                    onClick={parameter.toggle}
                    className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Cancel
                </button>
                </div>
            </div>
        </div>
    );
}
 
export default CardDetail;