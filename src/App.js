import { Routes,Route,Outlet } from "react-router-dom";
import ProtectedRoute from "./context/Middleware";
import { AuthContextProvider } from "./context/AuthContext";
import LoginPage from "./Pages/loginPage";
import RegisterPage from "./Pages/registerPage";
import HomePage from "./Pages/homePage";
import InviteLink from "./Pages/inviteLinkPage";
import WorkspacePage from "./Pages/workspacePage";
import BoardInvite from "./Pages/boardInvite";
import ClosedBoardsPage from "./Pages/ClosedBoardsPage";
import BoardPage from "./Pages/boardPage";

export default function App() {
  return (
    <AuthContextProvider>
      <Routes>
          <Route exact path="/" element={<LoginPage></LoginPage>}/>
          <Route exact path="/register" element={<RegisterPage></RegisterPage>}/>
          <Route exact path="/home" element={<HomePage></HomePage>}/>
          <Route exact path="/workspaceinvite/:workspaceid" element={<InviteLink></InviteLink>}/>
          <Route exact path="/boardinvite/:boardid" element={<BoardInvite></BoardInvite>}/>
          <Route exact path="/workspace/:workspaceid" element={<WorkspacePage></WorkspacePage>}/>
          <Route exact path="/closedboards" element={<ClosedBoardsPage></ClosedBoardsPage>}/>
          <Route exact path="/board/:boardid" element={<BoardPage></BoardPage>}/>
      </Routes>
    </AuthContextProvider>
  )
}