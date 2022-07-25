import { addDoc, collection } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase.config";

const CreateWorkspaceModal = (parameter) => {
    const loggedIn = UserAuth();
    // console.log(loggedIn.user.uid);

    const addWorkspace=(e)=>{
        e.preventDefault();
        const visibility = e.target.public.checked;
        const workspacename = e.target.name.value;
            addDoc(collection(db,'workspace'),{
                Public: visibility,
                WorkspaceName: workspacename,
                members: [loggedIn.user.uid],
                admins: [loggedIn.user.uid],
                Favorite: []
            }).catch((error)=>{
        });
        parameter.toggle();
    }


    return ( 
        <div style={{background:'rgba(0,0,0,0.5)'}} className="z-20 fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div style={{height:"250px", width:"350px"}} className="flex-col text-center items-center rounded-lg bg-white">
                <p className="text-2xl mt-5">Add Workspace</p>
                <form className="mt-8 space-y-2" onSubmit={addWorkspace}>
                    <div className="m-3">
                        <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Workspace Name"
                        />
                    </div>
                    
                    <div className="flex items-center pt-2 m-4">
                        <input type="checkbox" name="public" id="public"  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor="public" className="ml-2 block text-sm text-gray-900">
                        Make Workspace Public
                        </label>
                    </div>
    
                    <div className="flex justify-center pt-6 space-x-5">
                        <button
                            type="submit"
                            className="group relative w-50 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            </span>
                            Create Workspace
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
 
export default CreateWorkspaceModal;