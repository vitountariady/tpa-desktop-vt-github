import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {Calendar, globalizeLocalizer} from "react-big-calendar"
import globalize from 'globalize'
import Navbar from "./Navbar";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase.config";
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = globalizeLocalizer(globalize)

const CalendarView = () => {
    const boardID = useParams().boardid
    const [eventList, seteventList] = useState([]);
    
    useEffect(() => {
       getData();
    }, [])

    const getData = async() =>{
        let arr=[]
        const q = query(collection(db,"list"),where("boardID",'==',boardID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((snap)=>{
            arr.push(snap.id)
        })
        if(arr!==[]){
            let eventData =[]
            const stringQuery = query(collection(db,"card"),where("ListID",'in',arr))
            const snapshot = await getDocs(stringQuery)
            snapshot.forEach((snap)=>{
                const data ={
                    title: snap.data().CardName,
                    start: snap.data().duedate,
                    end: snap.data().duedate,
                }
                eventData.push(data);
            })
            seteventList(eventData);
        }
    }
    

    return (
        <div>
            <Navbar></Navbar>
            <div className="w-full mt-24 h-full flex flex-col justify-start">
                <Link to={`/board/${boardID}`} className="w-fit ml-24 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 items-center p-2 rounded-lg text-white">Back</Link>
                <Calendar className="w-3/4"
                    localizer={localizer}
                    events={eventList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "100px" }}
                />
            </div>
        </div>
    );
}
 
export default CalendarView;