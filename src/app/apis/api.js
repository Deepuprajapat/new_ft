import axios from "axios";

const BASE_URL="http://15.207.69.218:9191"

// export const getAllProject = async()=>{
//     try {
//         const res = await axios.get(`${BASE_URL}/get/all/projects`);
//         console.log(res);
//         return res.data;
//     } catch (error) {
//         console.error('Error',error);
//         return[];
//     }
// };

export const getAllProject = async (page = 0, size = 100) => {
    try {
      const res = await axios.get(`${BASE_URL}/get/all/projects?isDeleted=false&page=${page}&size=${size}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { content: [] };
    }
  };
  
  export const getAllProjects = async (page = 0, size = 100) => {
    try {
      const res = await axios.get(`${BASE_URL}/get/all/projects?isDeleted=false&page=${page}&size=${size}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { content: [] };
    }
  };