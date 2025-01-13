import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import AddHeadScripts from "./pages/AddHeadScripts";
const AppLayout = ()=>{
    return(
     <>
     <AddHeadScripts/>
      <Header />
      <Outlet />
       <Footer/>
    </>
    );
};
export default AppLayout;