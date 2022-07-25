import Sidebar from "../Components/Sidebar"
import { useParams } from "react-router-dom";
import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { useState } from "react";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect } from "react";
import List from "../Components/List";
import Navbar from "../Components/Navbar";

const BoardPage = () => {
    const params = useParams();
    const [Lists, setLists] = useState([]);

    const addList = () =>{
        addDoc(collection(db,'list'),{
            ListName: "New List",
            boardID: params.boardid
        })
    }

    useEffect(() => {
        getLists();
    }, [params])
    

    const getLists = () =>{
        const q = query(collection(db,'list'),where('boardID','==',params.boardid));
        onSnapshot(q,(documents)=>{
            setLists(documents.docs);
        })
    }

    return ( 
        <div className="flex flex-row pt-16">
            <Navbar></Navbar>
            <div className="flex flex-row overflow-x-scroll">
                <div onClick={addList} className='m-5 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 min-w-[10rem] h-20 rounded-md flex flex-col justify-center items-center'>
                    <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                        <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                    </div>
                    <p>Create List</p>
                </div>
                {Lists.map((list)=>{
                    return(
                        <List list={list}></List>
                    )
                })}
            </div>
        </div>
    );
}
 
export default BoardPage;