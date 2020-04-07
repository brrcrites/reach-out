import axios from 'axios';

var axiosInterface = axios.create({
    baseURL: 'https://localhost:8081'
});

export default axiosInterface;