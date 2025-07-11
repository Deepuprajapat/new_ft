
// import Header from "./Header";
// import AddHeadScripts from "./pages/AddHeadScripts";
// const AppLayout = ()=>{
//     return(
//      <>
//      <AddHeadScripts/>
//       <Header />
//       <Outlet />
//        <Footer/>
//     </>
//     );
// };
// export default AppLayout;
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import AddHeadScripts from "./pages/AddHeadScripts";
import { useState } from "react";

const AppLayout = () => {
  const [shortAddress, setShortAddress] = useState("");

  return (
    <>
      <AddHeadScripts />
      <Header shortAddress={shortAddress} />
      <Outlet context={{ shortAddress,setShortAddress }} /> {/* 🔹 Pass function via context */}
      <Footer shortAddress={shortAddress} />
    </>
  );
};

export default AppLayout;
