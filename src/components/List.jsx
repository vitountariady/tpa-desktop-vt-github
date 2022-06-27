import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import {addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc} from 'firebase/firestore';
import { Trash } from 'heroicons-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../firebase.config';
import CardModal from './CardModal';
const List = (props) => {

    const [cards, setCards] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [cardModal, setCardModal] = useState(false);

    function ToggleCardModal(){
        setCardModal(!cardModal);
    }

    useEffect(() => {
        if(cardModal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [cardModal])

    useEffect(()=>{
        const q = query(collection(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.list.id,'card'));
        onSnapshot(q,(docs)=>{
            if(docs){
                setUpdated(!updated);
            let array=[];
            docs.forEach(doc=>{
                // console.log(doc.data());
                array.push({...doc.data(), id:doc.id});
            });
            setCards(array);
            }
            else{
                setCards([]);
            }
        });
    },[]);

    const handleChangeList =(e)=>{
        if(e.key === 'Enter'){
            updateDoc(doc(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.list.id),{
                ListName: e.target.value
            });
        }
    }

    const handleChangeCard =(e, cardid)=>{
        // console.log(cardid);
        if(e.key === 'Enter'){
            updateDoc(doc(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.list.id,'card',cardid),{
                CardTitle: e.target.value
            });
        }
    }
    
    const AddCard=()=>{
        addDoc(collection(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.list.id,'card'),{
            CardTitle: 'New Card',
            CardDescription: ''
        });
    }

    const DeleteCard=(cardid)=>{
        
        deleteDoc(doc(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',props.list.id,'card',cardid));
    }
    const DeleteList=(listid)=>{
        deleteDoc(doc(db, 'workspace',props.workspaceid, 'board', props.boardid ,'list',listid));
    }

    return (
        <div className='m-5 bg-neutral-300 w-56 min-h-96 h-fit rounded-md flex flex-col justify-start items-center'>
            <div className='m-5 bg-neutral-300 hover:bg-gray-200 active:bg-gray-300 w-48 h-8 rounded-lg flex flex-row justify-start items-center'>
                <input onKeyDown={(e)=>{handleChangeList(e);}} className='bg-neutral-300 rounded-md p-2 w-40 h-8 focus:outline-none focus:bg-neutral-200 font-bold' type="text" defaultValue={props.list.ListName} />
                <Trash onClick={()=>{DeleteList(props.list.id)}} className='ml-1 stroke-gray-600 fill-gray-600 '></Trash>
            </div>
            {cards.map((card)=>{
                return(
                    <div key={card.id} className='m-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-48 h-8 rounded-lg flex flex-row justify-start items-center'>
                        {cardModal && (
                            <CardModal card={card} workspaceid={props.workspaceid} boardid={props.boardid} close={ToggleCardModal} listid={props.list.id}></CardModal>
                        )}
                        <input onClick={ToggleCardModal} onKeyDown={(e)=>{handleChangeCard(e,card.id);}} className='m-0 p-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 w-40 h-8 rounded-lg' type="text" defaultValue={card.CardTitle} />
                        <Trash onClick={()=>{DeleteCard(card.id)}} className='ml-1 stroke-gray-600 fill-gray-600 '></Trash>
                    </div>
                );
            })}
            <div className='m-2 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 w-10 h-10 rounded-full flex flex-col justify-center items-center'>
                <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                    <PlusIconSolid onClick={AddCard} className="h-3 w-3" aria-hidden="true" />
                </div>
           </div>
        </div>
    );
}
 
export default List;