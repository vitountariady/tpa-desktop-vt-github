import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";

const MessageNotification = (parameter) => {
    const loggedIn = UserAuth();

    const deleteNotif = () =>{
        updateDoc(doc(db,'notifications',loggedIn.user.uid),{
            message: arrayRemove(parameter.message)
        })
    }

    return (
        <div>
            <div className="h-10 w-[36rem] m-5 flex flex-row justify-between space-x-10 items-center bg-neutral-300 p-7 rounded-lg">
                <p>{parameter.message}</p>
                <div className="flex flex-row space-x-3">
                    <button onClick={deleteNotif} className="w-20 bg-red-500  hover:bg-red-600 active:bg-red-700 h-8 text-white rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
}
 
export default MessageNotification;