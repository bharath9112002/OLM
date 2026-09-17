import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

export default axiosClient;
