import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../firebase.config";

const Member = (parameter) => {
    const [Name, setName] = useState('');
    useEffect(() => {
        getDoc(doc(db,'users',parameter.member)).then((document)=>{
            setName(document.data().FirstName + ' '+ document.data().LastName)
        });
    }, [parameter])

    const member =parameter.member;
    return(
        <div className="h-10 pl-3 rounded-lg w-[18rem] bg-gray-300 flex justify-start items-center">
            <p className="w-[80%] text-start">{Name}</p>
            {parameter.IsAdmin && (
                <button onClick={()=>{parameter.promoteMember(member)}} className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Promote
                </button>
            )}
             {(parameter.self(member)) && (
                <button onClick={()=>{parameter.removeMember(member)}} className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Leave
                </button>
            )}
             {(parameter.IsAdmin && !parameter.self(member) ) &&  (
                <button onClick={()=>{parameter.removeMember(member)}} className="w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Kick
                </button>
            )}
        </div>
    );
}
 
export default Member;