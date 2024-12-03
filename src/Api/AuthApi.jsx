import axios from 'axios';

const loginUser = async (formData) => {
  const response = await axios.post('https://kiemhieptinhduyen.one/login', formData, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const signupUser = async (formData) => {
  const response = await axios.post('https://kiemhieptinhduyen.one/signup', formData, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export { loginUser, signupUser };
