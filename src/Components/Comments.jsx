import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { comment } from "postcss";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import Comment from "./Comment";

const Comments = (parameter) => {
    const loggedIn = UserAuth();
    const [Comments, setComments] = useState([]);

    useEffect(() => {
        const q = query(collection(db,'card',parameter.card.id,'comments'))
        onSnapshot(q,(document)=>{
            setComments(document.docs);
        })
    }, [parameter])

    const AddComment = (()=>{
        let comment = document.getElementById("comment").value;
        console.log(comment);
        const colRef = collection(db,'card', parameter.card.id,'comments');
        addDoc(colRef,{
            author: loggedIn.user.uid,
            comment: comment
        })
    })

    return (
        <div>
            <div className="w-full flex flex-row">
                <input type="text" id="comment" className="w-[80%] p-1 border-black border-2 rounded-l-md" />
                <button onClick={AddComment} className="w-[20%] text-xs p-2 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white rounded-r-md">Add Comment</button>
            </div>
            <div className="w-full h-[7rem] flex flex-col overflow-y-auto">
                {Comments.length===0 && (
                    <div className="w-full border-2 h-[7rem] flex justify-center items-center">
                        <p className="text-xl font-thin">Empty</p>
                    </div>
                )}
                {Comments.map((comment)=>{
                    return(
                        <Comment card={parameter.card} comment={comment}></Comment>
                    )
                })}
            </div>  
        </div>
    );
}
 
export default Comments;