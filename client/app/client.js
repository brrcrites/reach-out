import axios from 'axios';

var axiosInterface = axios.create({
    baseURL: 'http://localhost:8081'
});

export default axiosInterface;
