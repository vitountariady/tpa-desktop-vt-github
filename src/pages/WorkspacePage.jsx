import { collection, onSnapshot, query} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";
import Workspace from "../components/Workspace";
import { db } from "../firebase.config";

const WorkspacePage = () => {
    const [boards, setboards] = useState([]);
    const params = useParams();

    
    useEffect(()=>{
        const q = query(collection(db,'workspace',params.workspaceid,'board'));
        onSnapshot(q,(docs)=>{
            let array=[];
            docs.forEach(doc=>{
                console.log(doc.data());
                array.push({...doc.data(), id:doc.id});
            });
            setboards(array);
        });
    },[params]);

    return ( 
        <div>
            <Navbar></Navbar>
            <div className="flex flex-row pt-16">
                <Sidebar></Sidebar>
                <Workspace workspaceid ={params.workspaceid} array={boards}></Workspace>
            </div>
        </div>
     );
}
 
export default WorkspacePage;