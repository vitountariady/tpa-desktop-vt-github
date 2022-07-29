import { TrashIcon } from "@heroicons/react/solid";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase.config";
import CardDetail from "../Pages/CardDetailPage";

const Card = (parameter) => {
    const [openDetail, setopenDetail] = useState(false)
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

    const open=()=>{
        setopenDetail(true);
    }
    const close=()=>{
        setopenDetail(false);
    }

    const DeleteCard = ()=>{
        deleteDoc(doc(db,'card',parameter.card.id));
    }

    return (
        <div key={parameter.card.id} className='m-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-48 h-8 rounded-lg flex flex-row justify-start items-center'>
            {openDetail && (
                <CardDetail toggle={close} card={parameter.card}></CardDetail>
            )}
            <input onClick={open}  onKeyDown={(e)=>{handleChangeCard(e);}} className='m-0 p-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-40 h-8 rounded-lg' type="text" defaultValue={parameter.card.data().CardName} />
            <TrashIcon onClick={()=>{DeleteCard()}} className='ml-1 stroke-gray-600 fill-gray-600 '></TrashIcon>
        </div>
    );
}
 
export default Card;