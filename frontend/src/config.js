const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? '/api' : import.meta.env.VITE_API_URL;
export default apiUrl;
