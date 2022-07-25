import { TrashIcon } from "@heroicons/react/solid";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const Card = (parameter) => {
    const handleChangeCard =(e)=>{
        if(e.key === 'Enter'){
            if(e.target.value===''){
                return;
            }
            updateDoc(doc(db,'card',parameter.card.id),{
                CardName: e.target.value
            });
        }
    }

    const DeleteCard = ()=>{
        deleteDoc(doc(db,'card',parameter.card.id));
    }

    return (
        <div key={parameter.card.id} className='m-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-48 h-8 rounded-lg flex flex-row justify-start items-center'>
            <input onKeyDown={(e)=>{handleChangeCard(e);}} className='m-0 p-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-40 h-8 rounded-lg' type="text" defaultValue={parameter.card.data().CardName} />
        <TrashIcon onClick={()=>{DeleteCard()}} className='ml-1 stroke-gray-600 fill-gray-600 '></TrashIcon>
    </div>
    );
}
 
export default Card;