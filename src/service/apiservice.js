import axios from "axios";

export const addUserApi = async (data) => {
  try {
    console.log("Sending request with data:", data);
    console.log(process.env.API_REQUEST);

    const res = await axios.post("/api/createuser", 
      data
    );

    return res.data; 
  } catch (error) {
    console.error("API request failed:", error?.response?.data || error.message);
    
    throw error; // Re-throwing the error so the caller can handle it
  }
};
