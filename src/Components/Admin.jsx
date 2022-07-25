import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";

const Admin = (parameter) => {
    const [Name, setName] = useState('');
    useEffect(() => {
        getDoc(doc(db,'users',parameter.admin)).then((document)=>{
            setName(document.data().FirstName + ' '+ document.data().LastName)
        });
    }, [parameter.admin])
    return(
        <div className="h-10 pl-3 rounded-lg w-[18rem] bg-gray-300 font-extrabold flex justify-start items-center">
            <p className="w-[80%] text-start text-black">{Name}</p>
            {(parameter.IsAdmin && !parameter.self(parameter.admin) && !parameter.IsOnlyAdmin) &&  (
                <button onClick={()=>{parameter.demoteAdmin(parameter.admin)}} className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Demote
                </button>
            )}
            {(parameter.self(parameter.admin)) && (
                <button onClick={()=>{parameter.removeMember(parameter.admin)}} className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Leave
                </button>
            )}
             {(parameter.IsAdmin && !parameter.self(parameter.admin)) &&  (
                <button onClick={()=>{parameter.removeMember(parameter.admin)}} className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Kick
                </button>
            )}
        </div>
    );
}
 
export default Admin;