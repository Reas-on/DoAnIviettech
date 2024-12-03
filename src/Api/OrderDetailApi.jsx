import axios from "axios";

const baseURL = "https://kiemhieptinhduyen.one/orderData";

const OrderDetailApi = {
  getOrderDetail: async (orderNumber) => {
    try {
      const response = await axios.get(`${baseURL}/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw new Error("Failed to fetch order detail");
    }
  },
  updateOrder: async (orderId, newStatus, newMessage) => {
    try {
      const response = await axios.patch(`${baseURL}/${orderId}`, {
        status: newStatus,
        message: newMessage,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw new Error("Failed to update order");
    }
  },
  addLog: async (orderId, message) => {
    try {
      const response = await axios.post(`${baseURL}/${orderId}/logs`, { message });
      return response.data;
    } catch (error) {
      console.error('Error adding log:', error);
      return null;
    }
  }  
};

export default OrderDetailApi;
