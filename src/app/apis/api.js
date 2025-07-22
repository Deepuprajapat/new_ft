import axios from "axios";
// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://13.200.229.71:8282";

let BASE_URL = process.env.REACT_APP_BASE_URL;
let SECONDARY_URL = process.env.REACT_APP_SECONDARY_URL;

console.log("BASE_URL", BASE_URL);
console.log("SECONDARY_URL", SECONDARY_URL);

let token = "";

export const login = async (userName, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/generate-token`, {
      email: userName,
      password: password,
    });

    return response.data;
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

export const getAllDeveloper = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/developers`, {});
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
    // page,
    // size = 400,
    is_priority,
    is_premium,
    is_featured,
    // isDeleted,
    // status,
    developer_id,
    city,
    location_id,
    name,
    type,
    // configurations
  } = filters;
  try {
    const params = {
      // ...(page !== undefined && { page }),
      // ...(size !== undefined && { size }),
      // ...(isDeleted !== undefined && { isDeleted }),
      ...(is_priority !== undefined && { is_priority }),
      ...(is_premium !== undefined && { is_premium }),
      ...(is_featured !== undefined && { is_featured }),
      // ...(status && { status }),
      ...(developer_id && { developer_id }),
      ...(city && { city }),
      ...(location_id && { location_id }),
      ...(name && { name }),
      ...(type && { type: type.toUpperCase() }),
      // ...(configurations && { configurations }),
    };
    // console.log(`${BASE_URL}/v1/api/projects`)
    const res = await axios.get(`${BASE_URL}/projects`, { params });
    //  console.log("Fetched Projects:", res.data.data);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { content: [] };
  }
};

// Get project names for dropdown (optimized endpoint)
export const getProjectNames = async () => {
  const CACHE_KEY = 'investmango_projects_cache';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  // Check if we have valid cached data
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      const isValid = parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_DURATION);
      
      if (isValid && parsed.data) {
        return parsed.data;
      } else {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  } catch (cacheError) {
    localStorage.removeItem(CACHE_KEY);
  }
  
  // Fetch fresh data from API
  try {
    const res = await axios.get(`${BASE_URL}/projects/names`);
    
    // Cache the successful response
    try {
      const cacheData = {
        data: res.data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (cacheError) {
      // Don't fail the request if caching fails
    }
    
    return res.data;
  } catch (error) {
    console.error("Error fetching project names:", error);
    
    // Clear cache on API error to ensure we retry fresh next time
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (clearError) {
      // Silent fail
    }
    
    return { data: [] };
  }
};

//  get all project by urlname
// Get all projects by type (for modal project list)
export const getAllProjectsByType = async (type) => {
  try {
    const url = `${BASE_URL}/projects`;
    const params = {};
    if (type) params.type = type;
    const res = await axios.get(url, { params });
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching projects by type:", error);
    return [];
  }
};

// Get single project by urlName (for details page)
export const getAllProjectsByUrlName = async (Projectid, navigate) => {
  try {
    const url = `${BASE_URL}/projects/${Projectid}`;
    const res = await axios.get(url);
    return res.data.data || {};
  } catch (error) {
    console.error("Error fetching project by urlName:", error);
    if (error.response && error.response.status === 400) {
      navigate("/404");
    }
    return {};
  }
};

  //patch
  export const patchProjectByTestUrl = async (urlName,patchData) => {

    try {
      const res = await axios.patch(`${BASE_URL}/internal/projects/${urlName}`,
        patchData,
      );
      console.log(res,"fsfrf")
      return res.data.data || {};
    } catch (error) {
      console.error("Error patching project by test URL:", error);
      throw error;
    }
  };

export const patchProjectById = async (id, patchData) => {
  console.log("rrrr")
  try {
    const res = await axios.patch(`${BASE_URL}/internal/projects/${id}`,patchData);
    return res;
  } catch (error) {
    console.error("Error patching project by test URL:", error);
    throw error;
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


export const getAllBlog = async (is_published) => {
  try {
    const params = {};
    if (typeof is_published !== 'undefined') {
      params.is_published = is_published;
    }
    const res = await axios.get(
      `${BASE_URL}/blogs`,
      Object.keys(params).length ? { params } : undefined
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    return { content: [] };
  }
};


export const getDeveloperById = async (developer_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/developer/get/by/id/${developer_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching developers:", error);
    return [];
  }
};

export const fetchAllVacancies = async () => {
  try {
    const response = await fetch(
      `${SECONDARY_URL}/get/all/vacancies?isActive=true&page=0&size=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
    const response = await fetch(`${SECONDARY_URL}/user/save/hiring/by/ai`, {
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
    const response = await axios.get(`${BASE_URL}/locations`);
    const localities = response.data.data || [];

    // Filter out entries with 'unknown' city
    const filteredLocalities = localities.filter(
      (locality) =>
        locality.city &&
        locality.city.toLowerCase() !== "unknown"
    );

    // Create a unique set of cities
    const uniqueCitiesMap = new Map();
    filteredLocalities.forEach((locality) => {
      if (!uniqueCitiesMap.has(locality.city)) {
        uniqueCitiesMap.set(locality.city, {
          id: locality.id, // optional
          city: locality.city,
        });
      }
    });

    return Array.from(uniqueCitiesMap.values());
  } catch (error) {
    console.error("Error fetching localities:", error);
    return [];
  }
};

// API Call to Check Phone Number
export const checkPhoneNumberExists = async (phone) => {
  try {
    const response = await axios.get(`${BASE_URL}/leads`, {
      params: {
        phone: phone,
        page: 0,
        size: 12,
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

// API Call to Submit New Lead (without OTP)
export const submitLead = async (formData) => {
  const payload = {
    property_id: formData.property_id || "",
    project_id: formData.project_id || "",
    name: formData.username || formData.name,
    phone: formData.usermobile || formData.phone,
    email: formData.useremail || formData.email,
    message: formData.message || formData.usermsg || ""
  };

  try {
    const response = await axios.post(`${BASE_URL}/leads`, payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting lead:", error);
    throw new Error("Failed to submit lead.");
  }
};

export const sendOTP = async (
  phone,
  projectName,
  source,
  name,
  usermsg,
  email,
  userType,
  property_id = "",
  project_id = ""
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/leads/send-otp`,
      {
        property_id: property_id,
        project_id: project_id,
        name: name,
        phone: phone,
        email: email,
        message: usermsg || `Interested in ${projectName || 'property'}`
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/leads/validate-otp?phone=${phone}&OTP=${otp}`
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
      `${BASE_URL}/leads/resend-otp?phone=${phone}`
    );
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};


// Admin Leads API Endpoints
export const getAllLeadsAdmin = async (filters = {}) => {
  try {
    const token = localStorage.getItem("auth-token");
    const response = await axios.get(`${BASE_URL}/leads`, {
      headers: {
        "x-auth-token": token,
      },
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin leads:", error);
    throw new Error("Failed to fetch leads.");
  }
};

export const getLeadsDuplicates = async () => {
  try {
    const token = localStorage.getItem("auth-token");
    // For now, we'll implement duplicate detection on frontend
    // since there's no specific duplicates endpoint
    const response = await axios.get(`${BASE_URL}/leads`, {
      headers: {
        "x-auth-token": token,
      },
      params: { page: 0, size: 1000 } // Get more data to detect duplicates
    });
    
    const leads = response.data?.content || [];
    const duplicates = [];
    const phoneMap = new Map();
    const emailMap = new Map();
    
    leads.forEach(lead => {
      if (lead.phone && phoneMap.has(lead.phone)) {
        duplicates.push(lead);
        const existing = phoneMap.get(lead.phone);
        if (!duplicates.includes(existing)) duplicates.push(existing);
      } else if (lead.phone) {
        phoneMap.set(lead.phone, lead);
      }
      
      if (lead.email && emailMap.has(lead.email)) {
        duplicates.push(lead);
        const existing = emailMap.get(lead.email);
        if (!duplicates.includes(existing)) duplicates.push(existing);
      } else if (lead.email) {
        emailMap.set(lead.email, lead);
      }
    });
    
    return duplicates;
  } catch (error) {
    console.error("Error fetching lead duplicates:", error);
    throw new Error("Failed to fetch duplicate leads.");
  }
};

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


export const getAllProperties = async (
  page,
  pageSize,
  type,
  configuration,
  locality
) => {
  const params = {
    isDeleted: "false",
    page: page,
    size: pageSize,
  };

  if (type) params.type = type;
  if (configuration) params.configuration = configuration; // changed key
  if (locality) params.city = locality; // changed key

  const response = await axios.get(`${BASE_URL}/properties`, { params });
  return response.data.data; // Return the full object
};


export const getPropertyByUrlName = async (urlName) => {
  try {
    const res = await axios.get(`${BASE_URL}/properties/${urlName}`);
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching project by urlName:", error);
    return {}; // Return an empty object if there's an error
  }
};



// Get all locations
export const getAllLocations = async (city) => {
  try {
    let url = `${BASE_URL}/locations`;
    const config = {};
    if (city) {
      config.params = { city };
    }
    const res = await axios.get(url, config);
    console.log("Locations fetched successfully:", res.data.data);
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// PATCH property details by property_id (keep at the end)
export const patchPropertyDetails = async (propertyId, patchData) => {
  try {
    const token = localStorage.getItem("x-auth-token");

    const res = await axios.patch(
      `${BASE_URL}/internal/properties/${propertyId}`,
      patchData,
      {
        headers: {
          "x-auth-token": `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error patching property details:", error);
    throw error;
  }
};
// Save property to API
export const saveProperty = async (propertyData) => {
  try {
    const token = localStorage.getItem('auth-token');
    console.log("token", token)
    const res = await axios.post(`${BASE_URL}/internal/properties`, propertyData, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": `${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error saving property:", error);
    throw error;
  }
};

export const createnewproject = async (projectdata) => {
  try {
    const res = await axios.post(`${BASE_URL}/internal/projects`, projectdata, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error saving property:", error);
    throw error;
  }
};

export const compareProjectsAPI = async (projectIds) => {
  try {
    const response = await fetch(`${BASE_URL}/projects/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       body: JSON.stringify({ project_ids: projectIds }), // :white_check_mark: assuming backend expects "projectIds"
    });
    if (!response.ok) {
      throw new Error("Failed to fetch compared projects");
    }
    return await response.json();
  } catch (error) {
    console.error("Error comparing projects:", error);
    throw error;
  }
};

export const getAdminProperties = async (page = 1, pageSize = 10, filters = {}) => {
  try {
    const token = localStorage.getItem("auth-token") || localStorage.getItem("x-auth-token");
    
    const params = {
      page: page,
      page_size: pageSize,
    };

    // Add optional filters if provided
    if (filters.configuration) params.configuration = filters.configuration;
    if (filters.property_type) params.property_type = filters.property_type;
    if (filters.city) params.city = filters.city;

    const response = await axios.get(`${BASE_URL}/internal/admin/dashboard/properties`, {
      headers: {
        "x-auth-token": `${token}`,
        "Authorization": `${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin properties:", error);
    throw error;
  }
};

export const getAllBlogById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/blogs/${id}`);
    return res.data || {}; // Ensures that if the response body is empty, we return an empty object
  } catch (error) {
    console.error("Error fetching Blogs By URl:", error);
    return { content: [] };
  }
};

export const uploadImage = async ({ file_name, alt_keywords, file_path }) => {
  try {
    const payload = {
      file_name,
      alt_keywords,
      file_path
    };
    const response = await axios.post(
      `${BASE_URL}/upload`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const patchStaticSiteData = async (categories) => {
  try {
    const payload = {
      property_types: {
        commercial: ["SHOPS", "SUITS", "OFFICE", "RETAIL SHOP"],
        residential: ["1BHK", "2BHK", "3BHK", "4BHK", "VILLAS"]
      },
      categories_with_amenities: {
        categories: categories || {
          "Sports & Recreation": [
            { icon: ":swimmer:", value: "Swimming Pool" }
          ]
        }
      }
    };
    const response = await axios.patch(
      `${BASE_URL}/internal/static-site-data`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error patching static site data:", error);
    return null;
  }
};


export const CustomSearch = async ({ payload }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/internal/custom-search-page`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};


export const filterforgeneric = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/internal/projects/filters`,
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};

export const fetchfooterlinks = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/links`,
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};

export const getCustompage = async (slug) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/s/${slug}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};

export const getAmenties = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/internal/amenities`,
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};

export const checkSlugAvialableUrl = async (slug) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/internal/check-avialable-url`,slug
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};

export const SaveNewBlog = async (data ) => {
  try {
    const is_published = true;
    const res = await axios.post(
      `${BASE_URL}/internal/blogs`,
      data,
      {
        params: { is_published }
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};
export const EditBlog = async (data ,blog_id) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/internal/blogs/${blog_id}`,data
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};

export const getPropertyFromSlug = async (slug) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/s/properties/${slug}`
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    throw error;
  }
};

export const getProjectFromSlug = async (slug,navigate) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/s/projects/${slug}`
    );
    return res.data.data;
  } catch (error) {
      navigate("/404");
    return {};
  }
};


export const getAllAmenitiesWithCategorys = async ()=>{
  try {
    const res = await axios.get(
      `${BASE_URL}/internal/amenities`
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    return {};
  }

}
export const Addcategories = async (data)=>{
  try {
    const res = await axios.post(
      `${BASE_URL}/internal/category`,data
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    return {};
  }

}
      
export const Addamentiesforcategory = async (category_name,data)=>{
  try {
    const res = await axios.post(
      `${BASE_URL}/internal/category/${category_name}/amenities`,data,
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    return {};
  }
}

export const deleteamentiesforcategory = async (category_name,amenity_name)=>{
  try {
    const res = await axios.delete(
      `${BASE_URL}/internal/category/${category_name}/amenities/${amenity_name}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    return {};
  }
}

export const deletecategory = async (category_name)=>{
  try {   
    const res = await axios.delete(
      `${BASE_URL}/internal/category/${category_name}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error patching project details:", error);
    return {};
  }
}