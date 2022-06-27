import Register from "./components/register-form";
import Login from "./components/login-form";
import { Routes,Route,Outlet } from "react-router-dom";
import  Homepage from "./pages/Homepage";
import WorkspacePage from "./pages/WorkspacePage";
import BoardPage from "./components/BoardPage";
import InviteLinkPage from "./pages/InviteLinkPage";
import ProtectedRoute from "./context/Middleware";
import { AuthContextProvider } from "./context/AuthContext";

const Protect =()=>{
  return(
    <ProtectedRoute>
      <Outlet/>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthContextProvider>
      <Routes>
          <Route path="/register" element={<Register/>} />
          <Route exact path="/" element={<Login/>}/>
        <Route element={<Protect/>}>
          <Route exact path="/home" element={<Homepage/>}/>
          <Route exact path="/:workspaceid" element={<WorkspacePage/>}/>
          <Route exact path="/:workspaceid/:boardid" element={<BoardPage/>}/>
          <Route exact path="/invitelink/:workspaceid" element={<InviteLinkPage/>}/>
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}