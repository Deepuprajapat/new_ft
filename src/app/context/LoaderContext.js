// import React, { createContext, useContext, useState } from "react";
// import Loader from "../components/Loader"; // Import the Loader component

// const LoaderContext = createContext();

// export const LoaderProvider = ({ children }) => {
//   const [loading, setLoading] = useState(false); // Loader state

//   return (
//     <LoaderContext.Provider value={{ loading, setLoading }}>
//       {loading && <Loader />} 
//       {children}
//     </LoaderContext.Provider>
//   );
// };

// // Custom hook for easy access to loader state
// export const useLoader = () => useContext(LoaderContext);
