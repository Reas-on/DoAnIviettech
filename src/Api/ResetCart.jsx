import axios from "axios";

const resetCart = async (authToken) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
    };
    const response = await axios.patch(
      "https://kiemhieptinhduyen.one/api/cartreset",
      {},
      config 
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error resetting cart:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export { resetCart };
