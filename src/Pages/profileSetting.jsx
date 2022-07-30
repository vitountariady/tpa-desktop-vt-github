import { async } from "@firebase/util";
import { upload } from "@testing-library/user-event/dist/upload";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage,ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { db,storage } from "../firebase.config";

const ProfileSettingPage = () => {
    const loggedIn = UserAuth();
    const navigate = useNavigate();

    const saveImageURL = (x) =>{
        updateDoc(doc(db,'users',loggedIn.user.uid),{
            profilePicture: x
        })
    }

    const changeEmail = (e) =>{
        e.preventDefault()
        console.log(loggedIn.user)
        updateEmail(loggedIn.user,document.getElementById('email').value).then(console.log("successful")).catch((error)=>{console.log(error)})
    }
    const changePassword = (e) =>{
        e.preventDefault()
        console.log(loggedIn.user)
        updatePassword(loggedIn.user,document.getElementById('pass').value).then(console.log("successful")).catch((error)=>{console.log(error)})
    }

    const handleFileChange = async(e) =>{
        const file = e.target.files[0]
        const imageRef = ref(storage,`profile-pictures/${loggedIn.user.uid}/`)
        await uploadBytes(imageRef,file);
        saveImageURL(await getDownloadURL(imageRef));
    }

    const handleChangeFirstName =(e)=>{
        e.preventDefault()
        if(e.key === 'Enter'){
            if(e.target.value===''){
                return;
            }
            updateDoc(doc(db,'users',loggedIn.user.uid),{
                FirstName: e.target.value
            });
        }
    }
    
    const handleChangeLastName =(e)=>{
        e.preventDefault()
        if(e.key === 'Enter'){
            if(e.target.value===''){
                return;
            }
            updateDoc(doc(db,'users',loggedIn.user.uid),{
                LastName: e.target.value
            });
        }
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex flex-col w-full h-fit items-center justify-center">
                 <div className="drop-shadow-2xl bg-slate-100 w-[35rem] rounded-lg h-screen mt-28 flex flex-col items-center justify-start p-7 space-y-10">
                    <div className="w-full flex flex-row items-center justify-between">
                        <img className="w-52 h-52 rounded-full border-2" src={loggedIn.userData.profilePicture} alt=""/>
                        <div className="w-[50%] flex flex-col justify-center items-start space-y-2">
                            <p>First Name</p>
                            <input onKeyDown={(e)=>{handleChangeFirstName(e)}} type="text" className="p-1 rounded-md border-gray-400 border-2" defaultValue={loggedIn.userData.FirstName}/>
                            <p>Last Name</p>
                            <input onKeyDown={(e)=>{handleChangeLastName(e)}} type="text" className="p-1 rounded-md border-gray-400 border-2" defaultValue={loggedIn.userData.LastName} />
                            <p>Upload Profile Picture</p>
                            <input type="file" name="file" id="file" onChange={(e)=>{handleFileChange(e)}} />
                        </div>
                    </div>
                    <form onSubmit={changeEmail} className="flex flex-row w-full items-center justify-center space-x-0">
                        <input id="email" name="email" type="email" placeholder="User Email" className="p-1 w-[20rem] h-8 rounded-l-md border-gray-400 border-2" />
                        <button type="submit" className="h-8 w-32 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-r-md text-white">Update Email</button>
                    </form>
                    <form onSubmit={changePassword} className="flex flex-row w-full items-center justify-center space-x-0">
                        <input id="pass" name="pass" type="password" placeholder="User Password" className="p-1 w-[20rem] h-8 rounded-l-md border-gray-400 border-2" />
                        <button type="submit" className="h-8 w-32 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-r-md text-white">Update Pasword</button>
                    </form>
                 </div>
            </div>
        </div>
    );
}
 
export default ProfileSettingPage;