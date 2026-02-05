import { useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    
    const navigate = useNavigate();

    //STATES FOR LOGGING IN:
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(''); // NEW: Error state
    
    //Pulls in the contexts from our UserContext:
    const { login, logout, user } = useContext(UserContext);
    

    //LOGIN LOGIC FOR OUR LOGIN FORM:
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError(''); // Clear previous errors
        try{
            await login(email, password);
            console.log("Logged in");
            setEmail(''); // Clear form on success
            setPassword('');
        } catch(error){
            // Display the actual error message from the backend
            const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
            setLoginError(errorMessage);
            console.log("Login failed:", errorMessage);
        }
    };

    //LOGOUT:
    const handleLogout = async (event) => {
        event.preventDefault();
        try{
            await logout();
            console.log("Logged out");
            navigate('/');
        } catch (error) {
            console.log("Logout failed.");
        }
    };

    return (
        <nav className="navbar">
            <span className='navbar-title'><Link to="/">MAGICKAL DIARY</Link></span>
            <ul>
                <li><Link to="/">Home</Link></li>
                {user ? (
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle">Account</a>
                        <ul className="dropdown-menu">
                            <li><Link to="/edit-profile">{user.username}: Edit Profile</Link></li>
                            <li><a href="/logout" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </li>
                ) : (
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle">User</a>
                        <ul className="dropdown-menu" id='login-dropdown'>
                            <div className="auth-forms">
                                <div className="login-container">
                                    <h2 className='login-head'>Login</h2>
                                    {loginError && ( // NEW: Display error message
                                        <div className="error-message" style={{
                                            color: '#ff6b6b',
                                            backgroundColor: '#ffe0e0',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            fontSize: '14px'
                                        }}>
                                            {loginError}
                                        </div>
                                    )}
                                    <form onSubmit={handleLogin}>
                                        <div>
                                            <label>Email:</label>
                                            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                        </div>
                                        <div>
                                            <label>Password:</label>
                                            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                                        </div>
                                        <button type="submit">Login</button>
                                        <Link id="create-button" to="/signup">Create New Account</Link>
                                    </form>
                                </div>
                            </div>
                        </ul>
                    </li>
                )}
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">Tools</a>
                    <ul className="dropdown-menu">
                        <li><Link to="/notes">Notes</Link></li>
                        <li><Link to="/zodiac">Zodiac</Link></li>
                        <li><Link to="/iching">I Ching</Link></li>
                        <li><Link to="/text-entry">Text Entry</Link></li>
                        <li><Link to="/diary-entries">Diary Entries</Link></li>
                    </ul>
                </li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar