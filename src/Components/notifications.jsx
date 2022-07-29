import BoardDeleteNotification from "./boardDeleteNotification";
import BoardInviteNotification from "./boardInviteNotification";
import DeleteNotification from "./deleteNotification";
import InviteNotification from "./inviteNotification";
import MessageNotification from "./messageNotification";

const NotificationsWindow = (parameter) => {
    return (
        <div style={{background:'rgba(0,0,0,0.5)'}} className="fixed top-0 left-0 flex w-full min-h-full justify-center items-center">
            <div className="flex-col h-[30rem] w-[40rem] text-center z-100 items-center rounded-lg bg-white overflow-y-scroll">
                <p className="text-3xl font-bold mt-5">Notifications</p>
                {parameter.inviteNotifications.map((curr)=>{
                    return(
                        <InviteNotification workspaceid = {curr}></InviteNotification>
                    )
                })}
                {parameter.boardInviteNotifications.map((curr)=>{
                    return(
                        <BoardInviteNotification boardid = {curr}></BoardInviteNotification>
                    )
                })}
                {parameter.deleteNotifications.map((curr)=>{
                    return(
                        <DeleteNotification workspaceid = {curr}></DeleteNotification>
                    )
                })}
                {parameter.boardDeleteNotifications.map((curr)=>{
                    return(
                        <BoardDeleteNotification boardid = {curr}></BoardDeleteNotification>
                    )
                })}
                {parameter.messageNotifications.map((curr)=>{
                    return(
                        <MessageNotification message = {curr}></MessageNotification>
                    )
                })}
            <button onClick={parameter.toggle}>Close</button>
            </div>
            {/* {parameter.messageNotifications.map((curr)=>{
                return(
                )
            })} */}
        </div>
    );
}
 
export default NotificationsWindow;