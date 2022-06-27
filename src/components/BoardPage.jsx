import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase.config";
import Board from "./Board";
import Navbar from "./navbar";
import Sidebar from "./Sidebar";

const BoardPage = () => {
    const params = useParams();
    const [lists, setlists] = useState([]);

    useEffect(()=>{
        const q = query(collection(db,'workspace', params.workspaceid, 'board',params.boardid,'list'));
        onSnapshot(q,(docs)=>{
            if(docs){
                let array=[];
                docs.forEach(doc=>{
                    array.push({...doc.data(),id:doc.id});
                });
                setlists(array);
            }else{
                setlists([]);
            }
        })
    },[]);
    
    return (
        <div>
            <Navbar></Navbar>
            <div className="flex flex-row pt-16">
                <Sidebar></Sidebar>
                <Board key={params.workspaceid} workspaceid={params.workspaceid} boardid={params.boardid} array={lists}></Board>
            </div>
        </div>
    );
}
 
export default BoardPage;