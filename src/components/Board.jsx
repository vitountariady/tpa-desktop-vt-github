import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase.config';
import List from './List';
const Board = (props) => {
    const lists = props.array;

    function addList(){
        const ListName ="New List";
        const BoardID = props.boardid;
        const workspaceID = props.workspaceid;
        const Visiblity =true;
        addDoc(collection(db,'workspace',workspaceID,'board',BoardID,'list'),{
            ListName: ListName,
            Visiblity: Visiblity
        })
    }

    return (
        <div style={{width:"screen - 56"}} className="overflow-x-scroll flex h-screen">
            {lists.map((list)=>{
                return(
                    <List key={list} workspaceid={props.workspaceid} boardid={props.boardid} list={list}></List>
                )
            })}
           <div onClick={addList} className='m-5 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 min-w-[10rem] h-20 rounded-md flex flex-col justify-center items-center'>
                <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                    <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                </div>
                <p>Create List</p>
           </div>
        </div>
    );
}
 
export default Board ;