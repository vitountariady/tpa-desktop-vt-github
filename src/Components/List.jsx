import { PlusIcon as PlusIconSolid, TrashIcon } from "@heroicons/react/solid";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import Card from "./Card";

const List = (parameter) => {

    const [Cards, setCards] = useState([]);


    useEffect(() => {
        getCards();
    }, [parameter.list])
    
    const getCards = () =>{
        const q  = query(collection(db,'card'),where('ListID','==',parameter.list.id));
        onSnapshot(q,(documents)=>{
            setCards(documents.docs);
        })
    }

    const addCard=()=>{
        addDoc(collection(db,'card'),{
            CardDescription:'',
            CardName: 'New Card',
            ListID : parameter.list.id,
            labels:[],
            duedate:'',
        })
    }

    const handleChangeList =(e)=>{
        if(e.key === 'Enter'){
            if(e.target.value===''){
                return;
            }
            updateDoc(doc(db,'list',parameter.list.id),{
                ListName: e.target.value
            });
        }
    }

    const deleteList = () =>{
        deleteDoc(doc(db,'list',parameter.list.id));
    }

    return (
        <div className='m-5 bg-neutral-300 w-56 min-h-96 h-fit rounded-md flex flex-col justify-start items-center'>
            <div className='m-5 bg-neutral-300 hover:bg-gray-200 active:bg-gray-300 w-48 h-8 rounded-lg flex flex-row justify-start items-center'>
                <input onKeyDown={(e)=>{handleChangeList(e);}} className='bg-neutral-300 rounded-md p-2 w-40 h-8 focus:outline-none focus:bg-neutral-200 font-bold' type="text" defaultValue={parameter.list.data().ListName} />
                <TrashIcon onClick={deleteList} className='ml-1 stroke-gray-600 fill-gray-600 '></TrashIcon>
            </div>
            {Cards.map((card)=>{
                let name = card.data().CardName;
                if(name.toLowerCase().includes(parameter.search.toLowerCase()) || parameter.found===true){
                    return(
                        <Card key={card.id} card={card}></Card>
                    )
                }
            })}
            <div className='m-2 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 w-10 h-10 rounded-full flex flex-col justify-center items-center'>
                <div onClick={addCard} id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                    <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                </div>
           </div>
        </div>
    );
}
 
export default List;