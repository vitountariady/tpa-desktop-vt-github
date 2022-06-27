import Navbar from "../components/navbar"
import Sidebar from "../components/Sidebar";
 

const Homepage = () => {
    return ( 
        <div>
            <Navbar></Navbar>
            <div className="flex flex-row pt-16">
                <Sidebar></Sidebar>
            </div>
        </div>
    );
}
export default Homepage;

