import { PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BoardModal from './BoardModal';
const Workspace = (props) => {
    const [boardModal,setBoardModal] = useState(false);
    const boardlist = props.array;
    function ToggleBoardModal(){
        setBoardModal(!boardModal);
    }

    useEffect(() => {
        if(boardModal === true){
            document.body.style.overflow="hidden";
        }else{
            document.body.style.overflow = "visible"
        }
    }, [boardModal])

    return ( 
        <div style={{width:"screen - 56"}} className="flex h-screen">
            {boardModal && <BoardModal workspaceid={props.workspaceid} close={ToggleBoardModal} ></BoardModal>}
            {boardlist.map((board)=>{
                return(
                    <Link to={"/"+props.workspaceid+"/"+board.id} className='m-5 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 w-56 h-40 rounded-md flex flex-col justify-center items-center'>
                        <p className='text-xl text-center'>{board.BoardName}</p>
                        <p className='text-sm opacity-70 text-center'>{board.Description}</p>
                    </Link>
                )
            })}
           <div onClick={ToggleBoardModal} className='m-5 bg-neutral-300 hover:bg-neutral-200 active:bg-neutral-400 w-56 h-40 rounded-md flex flex-col justify-center items-center'>
                <div id='lingkaran' className='h-6 w-6 border-2 border-black p2 rounded-full flex justify-center items-center'>
                    <PlusIconSolid className="h-3 w-3" aria-hidden="true" />
                </div>
                <p>Create Board</p>
           </div>
        </div>
     );
}
 
export default Workspace;