import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { db } from "../firebase.config";
const auth = getAuth();


const RegisterPage = () => {
    const navigate = useNavigate();
    const [Error, setError] = useState('');

    function Validation(e){
        e.preventDefault();
        let email = e.target.email.value;
        let password = e.target.password.value;
        let confpass = e.target.confirmpassword.value;
        let tnc = e.target.tnc.checked;
        let errorDiv = document.getElementById("errorDiv");
        if(password !== confpass){
          ErrorMessage("Passwords must be the same!");
        }else if(tnc === false){
          ErrorMessage("You need to agree to the terms and condition");
        }else{
          errorDiv.classList.add("hidden");
          createUser(e.target.firstname.value,e.target.lastname.value,email,password);
        }
    }


    const createUser = (firstname, lastname, email, password) =>{
        createUserWithEmailAndPassword(auth, email, password).then((cred)=>{
            setDoc(doc(db,'users',cred.user.uid),{
                FirstName: firstname,
                LastName: lastname,
                email: email,
                profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            })
            setDoc(doc(db,'notifications',cred.user.uid),{
              delete :  [],
              boarddelete :  [],
              invite : [],
              boardinvite : [],
              message : []
          })
            navigate('/');
        }).catch((err)=>{
           ErrorMessage("Email already used to register an account");
        })
    }

    const ErrorMessage = (message)=>{
        let errorDiv = document.getElementById("errorDiv");
        errorDiv.classList.remove("hidden");
        setError(message);
    }

    return (
        <>
          <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register a new CHello account</h2>
              </div>
              <form className="mt-8 space-y-6" action="" onSubmit={Validation}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="first-name" className="sr-only">
                      First Name
                    </label>
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="First Name"
                    />
                  </div>
    
                  <div>
                    <label htmlFor="last-name" className="sr-only">
                      Last Name
                    </label>
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Last Name"
                    />
                  </div>
    
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
    
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
    
                  <div>
                    <label htmlFor="confirmpassword" className="sr-only">
                      Confirm Passsword
                    </label>
                    <input
                      id="confirmpassword"
                      name="confirmpassword"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm Password"
                    />
                  </div>
    
                  <div className="flex items-center pt-4">
                    <input type="checkbox" name="tnc" id="tnc"  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      I agree to the terms and conditions
                    </label>
                  </div>
    
                </div>
    
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                </div> */}
    
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    </span>
                    Sign in
                  </button>
                </div>
    
    
                <div className="grid justify-items-center">
                    <p className="font-medium text-indigo-800">
                        Already have an account ?
                    </p>
                    <a href="./" className="font-medium text-indigo-600 hover:text-indigo-500">
                       Sign-in with your CHello account
                    </a>
                </div>
                <div className="hidden content-center grid justify-items-center rounded-md  bg-red-700 h-10" id="errorDiv">
                    <p className="font-small text-white" id="errorMessage">{Error}</p>
                </div>
              </form>
            </div>
          </div>
        </>
    );
}
 
export default RegisterPage;