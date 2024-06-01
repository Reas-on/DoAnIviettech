import axios from "axios";

const fetchVouchers = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/vouchers");
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};

export default fetchVouchers;