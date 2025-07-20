
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
  const [projectPhoneNumber,setprojectPhoneNumber] = useState("");
  console.log(projectPhoneNumber,"dddddddddd")
  return (
    <>
      <AddHeadScripts />
      <Header projectPhoneNumber={projectPhoneNumber} />
      <Outlet context={{  projectPhoneNumber, setprojectPhoneNumber }} /> {/* 🔹 Pass function via context */}
      <Footer projectPhoneNumber={projectPhoneNumber}  />
    </>
  );
};

export default AppLayout;
