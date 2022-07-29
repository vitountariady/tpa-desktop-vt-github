import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const ClosedBoardSetting = (parameter) => {
    const toggleOpen = () =>{
        updateDoc(doc(db,'board',parameter.board.id),{
            Open: true
        })
        parameter.toggle()
    }

    const deleteBoard = () =>{
        deleteDoc(doc(db,'board',parameter.board.id));
        parameter.toggle();
    }

    return (
        <div style={{background:'rgba(0,0,0,0.5)'}} className="fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div className="flex-col h-[10rem] w-[40rem] text-center z-100 items-center rounded-lg bg-white">
                <div className="w-full h-[5rem] flex rounded-t-lg justify-start items-center bg-white p-5 sticky top-0">
                    <p className="text-3xl font-bold">{parameter.board.data().BoardName +' (Closed)'}</p>
                </div>
                <div className="flex flex-row justify-around space-x-3 mt-2">
                    <button onClick={toggleOpen} className="w-[18rem] h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Reopen Board</button>
                    <button onClick={deleteBoard} className="w-[18rem] h-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete Board</button>
                </div>
            </div>
        </div>
    );
}
 
export default ClosedBoardSetting;