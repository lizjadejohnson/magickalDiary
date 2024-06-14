import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { useNavigate } from 'react-router-dom'; 
import Spinner from '../components/Spinner';
import MapComponent from '../components/MapComponent';


const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [locationOfBirth, setLocationOfBirth] = useState('');
  const [message, setMessage] = useState('');

  const { user, signup } = useContext(UserContext);

  //Needed to redirect with react-router-dom
  const navigate = useNavigate();


  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await signup(username, email, password, dob, timeOfBirth, locationOfBirth);
      setMessage('Signup successful! You can now log in.');
      //Redirects to home after successful login
      navigate('/');
    } catch (error) {
        const message = error.message || 'Signup failed. Please try again.';
        setMessage(message);
        setTimeout(() => setMessage(''), 3000);
      }
    };

    //If someone is already logged in:
    if (user) {
      return (
        <Spinner redirectTo={"/"} delay={3000} message={"User already logged in. Redirecting to homepage..."}/>
      );
    };

  return (
    <div className='signup-container'>

      <form onSubmit={handleSignUp}>
        <h2>Sign Up</h2>

        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>

        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>

        <div>
          <label>Date of Birth:</label>
          <input type="date" onChange={(event) => setDob(event.target.value)} required />
        </div>

        <div>
          <label>Time of Birth (if known):</label>
          <input type="time" onChange={(event) => setTimeOfBirth(event.target.value)} />
        </div>

        <div>
          <label>Location of Birth (if known):</label>
          <MapComponent setLocationOfBirth={setLocationOfBirth}/>
        </div>

        <button type="submit">Sign Up</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default SignUpPage;
