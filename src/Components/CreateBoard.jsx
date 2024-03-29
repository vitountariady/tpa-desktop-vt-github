import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";
import BoardInviteModal from "./BoardInviteModal";

const CreateBoardModal = (parameter) => {
    const LoggedIn = UserAuth();
    const [openInvite, setopenInvite] = useState(false);
    const [newBoard, setnewBoard] = useState({});

    const addBoard=(e)=>{
        e.preventDefault();
        const visibility = e.target.public.value;
        const workspacename = e.target.name.value;
        const description = e.target.desc.value
        addDoc(collection(db,'board'),{
            Public: visibility,
            BoardName: workspacename,
            Description: description,
            admins: [LoggedIn.user.uid],
            members: [LoggedIn.user.uid],
            Open: true,
            WorkspaceID: parameter.workspaceid,
            remove:[]
        }).then((document)=>{
            getDoc(doc(db,'board',document.id)).then((x)=>{
                console.log(x.data())
                setnewBoard(x);
                setopenInvite(true);
            })
        }).catch((error)=>{
            console.log(error);
        });
    }

    return (
        <div style={{background:'rgba(0,0,0,0.5)'}} className="z-20 left-0 top-0 fixed flex w-full min-h-full justify-center items-center">
            {openInvite && (
                <BoardInviteModal toggle={parameter.toggle} board ={newBoard}></BoardInviteModal>
            )}
            <div style={{height:"420px", width:"350px"}} className="flex-col text-center items-center rounded-lg bg-white">
                <p className="text-2xl mt-5">Add Board</p>
                <form className="mt-8 space-y-2" onSubmit={addBoard}>
                    <div className="m-3">
                        <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Board Name"
                        />
                    </div>

                    <div className="m-3">
                        <textarea name="desc" id="desc" placeholder="Board Description" cols="30" rows="10" className="resize-none h-36 w-full p-3 border border-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10" ></textarea>
                    </div>
                    
                    <div className="flex-col items-start space-y-2">
                        <label htmlFor="public" className="block text-sm text-gray-900">
                            Board Visibility
                        </label>
                        <select name="public" id="public">
                            <option value="boardmember">Board Member Only</option>
                            <option value="workspacemember">Workspace Member Only</option>
                            <option value="public">Public</option>
                        </select>
                        {/* <input type="checkbox" name="public" id="public"  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" /> */}
                    </div>

                    <div className="flex justify-center pt-6 space-x-5">
                        <button
                            type="submit"
                            className="group relative w-50 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            </span>
                            Create Board
                        </button>

                        <button
                            onClick={parameter.toggle}
                            className="group relative w-50 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            </span>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default CreateBoardModal;