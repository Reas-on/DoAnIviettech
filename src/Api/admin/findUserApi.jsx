const baseURL = 'https://kiemhieptinhduyen.one';
const findUserApi = {
  searchUser: async (searchQuery) => {
    try {
      const response = await fetch(`${baseURL}/users?query=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to search user");
      }
    } catch (error) {
      throw new Error("An error occurred while searching for user");
    }
  },
};

export default findUserApi;
