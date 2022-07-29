import Sidebar from "../Components/Sidebar"
import { useParams } from "react-router-dom";
import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { useState } from "react";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect } from "react";
import List from "../Components/List";
import Navbar from "../Components/Navbar";
import { async } from "@firebase/util";

const BoardPage = () => {
    const params = useParams();
    const [Lists, setLists] = useState([]);
    const [Board, setBoard] = useState([]);
    const [Search, setSearch] = useState('');
    const [Found, setFound] = useState(false);

    const addList = () =>{
        addDoc(collection(db,'list'),{
            ListName: "New List",
            boardID: params.boardid
        })
    }

    const onSearchBarChange = () =>{
        let search = document.getElementById("searchBar").value;
        setSearch(search);
    }

    const listContainsSearchedCard = (listid) =>{
        const q  = query(collection(db,'card'),where('ListID','==',listid));
        getDocs(q).then((documents)=>{
            documents.forEach((document)=>{
                let cardname = document.data().CardName;
                if(cardname.toLowerCase().includes(Search.toLowerCase())){
                    setFound(true);
                    return;
                }else{
                    setFound(false);
                }
            })
        })
    }

    useEffect(() => {
        getLists();
    }, [params])

    const getLists = () =>{
        onSnapshot(doc(db,'board',params.boardid),(snap)=>{
            setBoard(snap.data());
        })
        const q = query(collection(db,'list'),where('boardID','==',params.boardid));
        onSnapshot(q,(documents)=>{
            setLists(documents.docs);
        })
    }

    return ( 
        <div>
            <Navbar></Navbar>
            <p className="mt-24 ml-6 text-3xl font-semibold text-black">{Board.BoardName}</p>
            <p className="mt-2 ml-6 w-fit p-2 rounded-xl text-white text-md font-semibold bg-neutral-500">Board</p>
            <input onChange={onSearchBarChange} id="searchBar" type="text" placeholder="Search" className="m-6 border-black border-2 rounded-lg p-1 w-96" />
            <div className="flex flex-row">
                <div className="flex flex-row overflow-x-scroll">
                    <div onClick={addList} className='m-5 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 min-w-[10rem] h-20 rounded-md flex flex-col justify-center items-center'>
                        <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                            <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                        </div>
                        <p>Create List</p>
                    </div>
                    {Lists.map((list)=>{
                        let name = list.data().ListName
                        listContainsSearchedCard(list.id);
                        if(name.toLowerCase().includes(Search.toLowerCase()) || Found === true){
                            return(
                                <List search={Search} list={list}></List>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    );
}
 
export default BoardPage;