import {arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";

const WorkspaceSetting = (props) => {
    const [users, setUser] = useState([]);
    const [admins, setAdmin] = useState([]);
    const [workspace,setWorkspace] = useState([]);
    const [inivtelink,setlink] = useState('');
    const [isadmin,setisadmin]= useState(false);
    const [soleadmin,setsoleadmin]= useState(true);
    const {user} = UserAuth();
    
    const generateLink =()=>{
        let link='localhost:3000/invitelink/'+props.workspaceid;
        setlink(link);
    }

    useEffect(() => {
        const q = query(doc(db,'workspace',props.workspaceid));
        onSnapshot(q,(docs)=>{
            setWorkspace(docs.data());
            const adms = docs.data().admins;
            const members = docs.data().userUID;
            adms.forEach(adm=>{
                const q3 = query(collection(db,'users'),where('UID','==',adm));
                onSnapshot(q3,(dox)=>{
                    if(adms.length>1){
                        setsoleadmin(false);
                    }
                    if(user.uid===adm){
                        setisadmin(true);
                    }
                    const temp = {...dox.docs[0].data(),id:dox.docs[0].id};
                    setAdmin((oldArray)=>[...oldArray,temp]);
                })
            })
            members.forEach(member=>{
                const q2= query(collection(db,'users'),where('UID','==',member));
                onSnapshot(q2,(dox)=>{
                    if(!admins.includes(dox.docs[0].data())){
                        const temp ={...dox.docs[0].data(),id:dox.docs[0].id};
                        setUser((oldArray)=>[...oldArray,temp]);
                    }
                });
            })
        });
    }, []);

    const promoteMember=(memberid)=>{
        updateDoc(doc(db,'workspace',props.workspaceid),{
            userUID: arrayRemove(memberid),
            admins: arrayUnion(memberid)
        });
        setUser([]);
        setAdmin([]);
        setsoleadmin(true);
    }
    
    const demoteAdmin=(adminid)=>{
        updateDoc(doc(db,'workspace',props.workspaceid),{
            userUID: arrayUnion(adminid),
            admins: arrayRemove(adminid)
        });
        setUser([]);
        setAdmin([]);
        setsoleadmin(true);
    }

    
    return (
    <div style={{background:'rgba(0,0,0,0.5)'}} className="z-20 fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
        <div className="flex-col h-[30rem] w-[40rem] text-center items-center rounded-lg bg-white overflow-y-scroll">
            <div className="w-full h-[5rem] flex rounded-t-lg justify-start items-center p-5 sticky top-0">
                <p className="text-3xl font-bold">{workspace.WorkspaceName}</p>
            </div>
            <div className="m-1 h-fit w-[20rem] flex flex-col justify-center items-start p-5 space-y-3">
                <p className="text-2xl">Members</p>                     
                {admins.map((admin)=>{
                    return(
                        <div className="h-10 pl-3 rounded-lg w-[18rem] bg-gray-300 font-extrabold flex justify-start items-center">
                            <p className="w-[80%] text-start">{admin.FirstName}</p>
                            {(isadmin&&!soleadmin) &&  (
                                <button onClick={()=>{demoteAdmin(admin.UID)}} className="group relative w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Demote
                                </button>
                            )}
                        </div>
                    );
                })}
                {users.map((member)=>{
                    return(
                        <div className="h-10 pl-3 rounded-lg w-[18rem] bg-gray-300 flex justify-start items-center">
                            <p className="w-[80%] text-start">{member.FirstName}</p>
                            {isadmin && (
                                <button onClick={()=>{promoteMember(member.UID)}} className="group relative w-50 h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Promote
                                </button>
                            )}
                        </div>
                    );
                })}
                {isadmin && (
                    <button onClick={generateLink} className="h-10 pl-3 rounded-lg w-[18rem] bg-blue-500  hover:bg-blue-600 active:bg-blue-700 text-white">Generate Invite Link</button>
                    )}
                
                <p>{inivtelink}</p>
                <button
                    onClick={props.close}
                    className="group relative w-50 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Cancel
                </button>
            </div>
        </div>
    </div> );
}
 
export default WorkspaceSetting;