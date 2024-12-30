import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://13.200.229.71:8282";
const BASE_URL1 = process.env.REACT_APP_BASE_URL || "http://3.111.119.169:8080";
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
    console.log("userName" + userName);
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
      console.log("this user ", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const currentUser = async (token) => {
  try {
    console.log("token  //////", token);

    const res = await axios.get(`${BASE_URL}/auth/current`, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    console.log("repsonse : :", res);
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
    console.log(JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error("Error fetching in Property Configuration");
    return { content: [] };
  }
};

export const getAllProject = async (page = 0, size = 500) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/project/get/all?isDeleted=false&page=${page}&size=${size}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { content: [] };
  }
};

//  get all project by urlname
export const getAllProjectsByUrlName = async (urlName) => {
  try {
    const res = await axios.get(`${BASE_URL}/project/get/by/url/${urlName}`);
    console.log("Data fetch:", res.data); // Logs the data for debugging
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching project by urlName:", error);
    return {}; // Return an empty object if there's an error
  }
};

export const getAllBlogByUrl = async (blogUrl) => {
  try {
    const res = await axios.get(`${BASE_URL}/blogs/get/by/url/${blogUrl}`);
    console.log("Data fetch:", res.data); // Logs the data for debugging
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
    console.log("Data fetched:", res.data); // Logs the data for debugging
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching floor plans:", error);
    return { content: [] }; // Return an empty array if there's an error
  }
};

export const getAllBlog = async (page = 0, size = 500) => {
  try {
    const res = await axios.get(`${BASE_URL}/blogs/get/all?isDeleted=false&page=${page}&size=${size}`);
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
      `${BASE_URL}/testimonials/get/all?page=0&size=12`
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
    console.log("Starting fetchAllVacancies...");

    const response = await fetch(`${BASE_URL1}/get/all/vacancies`);
    console.log("Response received:", response);

    if (!response.ok) {
      console.error("Response not OK:", response.statusText);
      throw new Error(`Error fetching vacancies: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Parsed JSON data:", data);

    // Check if the expected structure exists
    if (data && data.content) {
      console.log("Vacancies content:", data.content);
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
    console.log("FormData Payload:", Array.from(formData.entries()));

    const response = await fetch(`${BASE_URL1}/user/save/hiring/by/ai`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status}, Details: ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error Submitting Form:", error);
    throw error;
  }
};

export const getAllLocalities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/locality/get/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching localities:", error);
    return [];
  }
};

export const sendOTP = async (phone, projectName, source, name, email) => {
  try {
    const response = await axios.post(`${BASE_URL}/leads/save/new/and/send-otp`, {
      name: name,
      phone: phone,
      email: email,
      projectName: projectName,
      source: source,
    });
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
}

export const verifyOTP = async (phone, otp) => {
  try {
    const response = await axios.patch(`${BASE_URL}/leads/validate/otp?phone=${phone}&OTP=${otp}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

export const resendOTP = async (phone) => {
  try {
    const response = await axios.patch(`${BASE_URL}/leads/resend/otp?phone=${phone}`);
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
}

export const getLeadByPhone = async (phone) => {
  try {
    const response = await axios.get(`${BASE_URL}/leads/get/by/phone/${phone}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lead by phone:", error);
    return [];
  }
}

export const saveLead = async (lead) => {
  try {
    const response = await axios.post(`${BASE_URL}/leads/save/new`, lead);
    return response.data;
  } catch (error) {
    console.error("Error saving lead:", error);
    throw error;
  }
}

