import axios from "axios";
import { useNavigate } from "react-router-dom";
// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://13.200.229.71:8282";

// let BASE_URL = process.env.REACT_APP_BASE_URL;
// let BASE_URL1 = process.env.REACT_APP_BASE_URL1;
const BASE_URL="https://api.investmango.com"
const BASE_URL1="https://api.virtualintelligence.co.in"


console.log("BASE_URL", BASE_URL);
console.log("BASE_URL1", BASE_URL1);  

// if (process.env.REACT_APP_ENV === "production") {
//   BASE_URL = process.env.REACT_APP_BASE_URL;
// }

// if (process.env.REACT_APP_ENV === "production") {
//   BASE_URL1 = process.env.REACT_APP_BASE_URL1;
// }
// const BASE_URL1 = "https://api.virtualintelligence.co.in";
let token = "";

export const login = async (userName, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/generate-token`, {
      userName,
      password,
    });
    token = response.data.token;
    localStorage.setItem("authToken", token);
    localStorage.setItem("userName", userName);
    return token;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("x-auth-token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const currentUser = async (token) => {
  try {

    const res = await axios.get(`${BASE_URL}/auth/current`, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Error fetching Current User:", error);
    return { content: [] };
  }
};

export const getAllLocality = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/locality/get/all`, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Error Fetching Locality", error);
    return { content: [] };
  }
};

export const getAllDeveloper = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/developer/get/all`, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Error Fetching Developer", error);
    return { content: [] };
  }
};


export const getAllAmenitiesWithCategory = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/amenity/get/all`, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Error Fetching in Amenities", error);
    return { content: [] };
  }
};

export const getAllPropertyConfiguration = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/project-configuration-type/get/all`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching in Property Configuration");
    return { content: [] };
  }
};

export const getAllProject = async (filters = {}) => {
  const {
    page,
    size = 400,
    isPriority,
    isPremium,
    isFeatured,
    isDeleted,
    status,
    developerId,
    cityId,
    localityId,
    name,
    type,
    configurations
  } = filters;

  try {
    const params = {
      ...(page !== undefined && { page }),
      ...(size !== undefined && { size }),
      ...(isDeleted !== undefined && { isDeleted }),
      ...(isPriority !== undefined && { isPriority }),
      ...(isPremium !== undefined && { isPremium }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(status && { status }),
      ...(developerId && { developerId }),
      ...(cityId && { cityId }),
      ...(localityId && { localityId }),
      ...(name && { name }),
      ...(type && { type: type.toUpperCase() }),
      ...(configurations && { configurations }), 
    };

    const res = await axios.get(`${BASE_URL}/project/get/all`, { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { content: [] };
  }
};

//  get all project by urlname
export const getAllProjectsByUrlName = async (urlName ,navigate) => {
  try {
    const res = await axios.get(`${BASE_URL}/project/get/by/url/${urlName}`);
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching project by urlName:", error);
    if (error.response && error.response.status === 400) {
      navigate("/404"); // Redirects to the 404 page
    }
    return {}; // Return an empty object if there's an error
  }
};

export const getAllBlogByUrl = async (blogUrl) => {
  try {
    const res = await axios.get(`${BASE_URL}/blogs/get/by/url/${blogUrl}`);
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching Blogs By URl:", error);
    return { content: [] };
  }
};

//floor-plan/get/all
export const getAllFloor = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/floor-plan/get/all`, {
      params: {
        ...params,
      },
    });
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching floor plans:", error);
    return { content: [] }; // Return an empty array if there's an error
  }
};

export const getAllBlog = async (page = 0, size = 500) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/blogs/get/all?isDeleted=false&page=${page}&size=${size}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    return { content: [] };
  }
};

export const getAllDevelopers = async () => {
  try {
    // Make the API request
    const res = await axios.get(
      `${BASE_URL}/developer/get/all?isVerifed=true&isActive=true`
    );
    // Return the data from the API
    return res.data;
  } catch (error) {
    // Handle errors and log them
    console.error("Error fetching developers:", error);
    return []; // Return an empty array if there's an error
  }
};

export const getDeveloperById = async (developerId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/developer/get/by/id/${developerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching developers:", error);
    return [];
  }
};

export const getAllTestimonials = async () => {
  try {
    // Make the API request
    const res = await axios.get(
      `${BASE_URL}/developer/get/all?isVerifed=true&isActive=true`
    );
    // Return the data from the API
    return res.data;
  } catch (error) {
    // Handle errors and log them
    console.error("Error fetching developers:", error);
    return []; // Return an empty array if there's an error
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/testimonials/get/all?page=0&size=100`
    );
    if (response.ok) {
      const data = await response.json(); // Parse the JSON response
      return data.content || []; // Return the content array if available
    } else {
      console.error("Failed to fetch testimonials:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return []; // Return an empty array in case of error
  }
};

export const fetchAllVacancies = async () => {
  try {
    const response = await fetch(`${BASE_URL1}/get/all/vacancies?isActive=true&page=0&size=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
 
    });
    if (!response.ok) {
      console.error("Response not OK:", response.statusText);
      throw new Error(`Error fetching vacancies: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.content) {
    } else {
      console.warn("No 'content' field in the response data.");
    }

    return data.content || [];
  } catch (error) {
    console.error("Error in fetchAllVacancies:", error.message);
    return [];
  } finally {
    console.log("fetchAllVacancies execution finished.");
  }
};

// Function to submit hiring form data
export const submitHiringForm = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL1}/user/save/hiring/by/ai`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status}, Details: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error Submitting Form:", error);
    throw error;
  }
};


export const getAllLocalities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/locality/get/all`);
    const localities = response.data || []; // Default to an empty array if no data
    // Filter out localities with 'unknown' or 'UNKNOWN' in the city name or any other relevant fields
    const filteredLocalities = localities.filter(
      (locality) => locality.city.name.toLowerCase() !== "unknown"
    );
    // Map filtered localities to extract city details and ensure uniqueness
    const uniqueCities = Array.from(
      new Map(
        filteredLocalities.map((locality) => [locality.city.id, locality.city])
      ).values()
    );
    return uniqueCities; // Returns an array of { id, name } objects
  } catch (error) {
    console.error("Error fetching localities:", error);
    return [];
  }
};

export const getAllLocalitiess = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/locality/get/all`);
    const localities = response.data || []; 

    // // Filter out localities with 'unknown' or 'UNKNOWN' in the city name or any other relevant fields
    // const filteredLocalities = localities.filter(
    //   (locality) => locality.city.name.toLowerCase() !== "unknown"
    // );

    // // Map filtered localities to extract city details and ensure uniqueness
    // const uniqueCities = Array.from(
    //   new Map(
    //     filteredLocalities.map((locality) => [locality.city.id, locality.city])
    //   ).values()
    // );

    return localities; // Returns an array of { id, name } objects
  } catch (error) {
    console.error("Error fetching localities:", error);
    return [];
  }
};

// export const getLeadByPhone = async (phone) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/leads/get/by/phone/${phone}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching lead by phone:", error);
//     return [];
//   }
// };

// API Call to Check Phone Number
export const checkPhoneNumberExists = async (phone) => {
  try {
    const response = await axios.get(`${BASE_URL}/leads/get/all`, {
      params: {
        phone: phone,
        page: 0,
        size: 300,
      },
    });

    // Handle the paginated response properly
    const leads = response.data?.content || [];
    return leads.some((lead) => lead.phone === phone);
  } catch (error) {
    console.error(
      "Error checking phone number:",
      error.response || error.message
    );
    throw new Error("Failed to check phone number.");
  }
};

// API Call to Submit New Lead
export const submitLead = async (formData) => {
  const payload = {
    id: 0,
    createdDate: new Date().getTime(),
    updatedDate: new Date().getTime(),
    name: formData.username,
    phone: formData.usermobile,
    email: formData.useremail,
    projectName: formData.usermsg,
    message: formData.message,
    source: formData.source,
    otp: "", // Sending OTP-related fields if needed
    frequency: 1,
  };

  try {
    const response = await axios.post(`${BASE_URL}/leads/save/new`, payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting lead:", error);
    throw new Error("Failed to submit lead.");
  }
};

export const sendOTP = async (phone, projectName, source, name, usermsg,email,userType) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/leads/save/new/and/send-otp`,
      {
        name: name,
        phone: phone,
        email: email,
        message:usermsg,
        projectName: projectName,
        source: source,
        userType: userType,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/leads/validate/otp?phone=${phone}&OTP=${otp}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const resendOTP = async (phone) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/leads/resend/otp?phone=${phone}`
    );
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};

// export const saveLead = async (lead) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/leads/save/new`, lead);
//     return response.data;
//   } catch (error) {
//     console.error("Error saving lead:", error);
//     throw error;
//   }
// };

export const getAllGenericKeywords = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/generic/keywords/get/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Keywords:", error);
    return [];
  }
};

export const getGenericKeywordByPath = async (path) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/generic/keywords/get/by/path/data/${path}` 
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Keywords by Path:", error);
    return null;
  }
};



export const getAllCities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/city/get/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  } 
}

export const getAllProperties = async (page, pageSize, propertyType, configuration, locality) => {

  const url = new URL(`${BASE_URL}/property/get/all`);
  const params = {
    isDeleted: 'false',
    page: page,
    size: pageSize,
  };

  if (propertyType) {
    params.propertyType = propertyType;
  }

  // Only add configuration if it's provided
  if (configuration) {
    params.configurationName = configuration;
  }

  // Only add locality if it's provided
  if (locality) {
    params.cityId = locality;
  }
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
  const response = await fetch(url);
  const data = await response.json();
  return data;
};


// export const getAllProperties = async (filters = {}) => {
//   const {
//     page = 0,
//     size = 10,
//     propertyType,
//     configTypeName,
//     configurationName,
//     name,
//     localityId,
//   } = filters;

//   try {
//     const params = {
//       ...(page !== undefined && { page }),
//       ...(size !== undefined && { size }),
//       isDeleted: false, // This will always be 'false'
//       ...(propertyType && { propertyType }),
//       ...(configTypeName && { configTypeName }),
//       ...(configurationName && { configurationName }),
//       ...(name && { name }),
//       ...(localityId && { localityId }),
//     };

//     const response = await axios.get(`${BASE_URL}/property/get/all`, { params });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     return { content: [], totalPages: 0 };
//   }
// };



// const getAllProperties = async (page, pageSize, propertyType, configuration, locality) => {
//   // const url = new URL('http://15.207.69.218:9191/get/all/projects');
//   const url = new URL(`${BASE_URL}/property/get/all`);
//   const params = {
//     isDeleted: 'false',
//     page: page,
//     size: pageSize,
//     propertyType: propertyType || '', // Pass the selected property type (empty string if not selected)
//     projectConfigurationName: configuration || '', // Pass the selected configuration (empty string if not selected)
//     locality: locality || '' // Pass the selected locality (empty string if not selected)
//   };
//   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// };



export const getPropertyByUrlName = async (urlName) => {
  try {
    const res = await axios.get(`${BASE_URL}/property/get/by/url/${urlName}`);
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching project by urlName:", error);
    return {}; // Return an empty object if there's an error
  }
};

export const getReraInfoByProjectId = async (projectId) => {
  try {
    const response = await axios.get(`${BASE_URL}/rera-info/get/by/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lead by phone:", error);
    return [];
  }
};

export const getAllCityForMobile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/locality/get/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}
export const getAllCityForMobileByCityName = async (cityName) => {
  try {
    const response = await axios.get(`${BASE_URL}/locality/get/all?cityName=${cityName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}