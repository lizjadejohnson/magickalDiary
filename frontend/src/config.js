//In development, apiUrl will be http://localhost:3000/api
//In production, apiUrl will be https://magickal-diary-backend.onrender.com/api (because we'll have that set in Render)

// const isDevelopment = import.meta.env.MODE === 'development';
// const apiUrl = isDevelopment ? 'http://localhost:3000/api' : `${import.meta.env.VITE_API_URL}`;
// console.log('Environment Mode:', import.meta.env.MODE);  // Should output 'development' in local dev
// console.log('API URL:', apiUrl);  // Should output 'http://localhost:3000/api' in local dev
// export default apiUrl;



const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL:', apiUrl);  // This should output the correct API URL based on the environment
export default apiUrl;
