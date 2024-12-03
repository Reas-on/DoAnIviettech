import axios from "axios";

const fetchVouchers = async () => {
  try {
    const response = await axios.get("https://kiemhieptinhduyen.one/api/vouchers");
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};

export default fetchVouchers;