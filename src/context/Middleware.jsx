import { UserAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {user} = UserAuth();
    if(!user){
        return <Navigate to="/" />;   
    }
    return children;
}
 
export default ProtectedRoute;