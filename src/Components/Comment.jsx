import { deleteDoc, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";

const Comment = (parameter) => {
    const [User, setUser] = useState({});
    const [IsAuthor, setIsAuthor] = useState(false);

    const loggedIn = UserAuth();

    const deleteComment = () =>{
        deleteDoc(doc(db,'card',parameter.card.id,'comments',parameter.comment.id))
    }

    useEffect(() => {
        const q = query(doc(db,'users',parameter.comment.data().author));
        onSnapshot(q,(document)=>{
            setUser(document.data());
            if(document.id === loggedIn.user.uid){
                setIsAuthor(true);
            }
        })
    }, [parameter])
    

    return (
        <div className="w-full h-30 bg-slate-300 p-5 rounded-lg my-2">
            <div className="w-full flex flex-row">
                <p className="text-xl font-semibold">{parameter.comment.data().comment}</p>
            </div>
            <div className="w-full flex flex-row-reverse">
                <p className="italic">{User.FirstName +' '+ User.LastName}</p>
            </div>
            {IsAuthor && (
                <button onClick={()=>{deleteComment()}} className="bg-red-500 hover:bg-red-400 active:bg-red-600 text-white flex items-center justify-center p-1 rounded-md">Delete</button>
            )}
        </div>
    );
}
 
export default Comment;