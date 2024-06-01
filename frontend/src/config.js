const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? 'http://localhost:3000/api' : import.meta.env.VITE_API_URL;
console.log('Environment Mode:', import.meta.env.MODE);
console.log('API URL:', apiUrl);
export default apiUrl;