import {useQuill} from "react-quilljs";
import 'quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import Checklist from "../Components/Checklist";
import Comments from "../Components/Comments";
const CardDetail = (parameter) => {
    const modules ={
        toolbar: [["bold", "italic", "underline", "strike"]]
    }

    const {quill, quillRef} = useQuill({modules})
    const [Checklists, setChecklists] = useState([]);

    useEffect(() => {
        if(quill){
            quill.clipboard.dangerouslyPasteHTML(
                parameter.card.data().CardDescription
            )
        }
    })

    const addChecklist = () =>{
        addDoc(collection(db, 'card',parameter.card.id,'checklist'),{
            checklistName: "New Checklist",
            done: false
        })
    }

    useEffect(()=>{
        const q = query(collection(db, 'card',parameter.card.id,'checklist'))
        onSnapshot(q,(snap)=>{
            setChecklists(snap.docs);
        })
    },[parameter.card])

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
    })


    return (
        <div  style={{background:'rgba(0,0,0,0.5)'}} className="z-10 fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div className="flex-col h-[30rem] w-[40rem] z-100 justify-start items-center p-5 rounded-lg bg-white overflow-y-scroll space-y-3">
                <p className="text-3xl font-bold">{parameter.card.data().CardName}</p>

                <p className="text-xl font-semibold">Card Description</p>
                <div className="w-full h-32">
                    <div ref={quillRef}></div>
                </div>

                <p className="pt-10 text-xl font-semibold">Checklist</p>
                <button onClick={addChecklist} className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 items-center p-2 rounded-lg text-white">Add Checklist</button>
                {Checklists.map((check)=>{
                    return(
                        <Checklist card={parameter.card} checklist={check}></Checklist>
                    )
                })}
                <p className="pt-10 text-xl font-semibold">Comments</p>
                <Comments card={parameter.card}></Comments>

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