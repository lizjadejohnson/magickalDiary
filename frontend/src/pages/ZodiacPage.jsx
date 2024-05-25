import { useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import Spinner from '../components/Spinner';
import WesternZodiac from '../components/WesternZodiac';
import ChineseZodiac from '../components/ChineseZodiac';

const ZodiacPage = () => {
    const { user } = useContext(UserContext);
    const [activeReading, setActiveReading]  = useState('');

    //If someone is not logged in:
    if (!user) {
        return (
          <Spinner redirectTo={'/'} delay={5000} message={"You must first login or create a new account. Redirecting to homepage..."}/>
        );
      };
    

      return (
        <div>
            <h1 className='zodiacTitle'>Zodiac Readings</h1>
            <div className='button-container'>
                <button onClick={() => setActiveReading('Western')}>Western Zodiac</button>
                <button onClick={() => setActiveReading('Eastern')}>Chinese Zodiac</button>
            </div>
            <div className='horoscopeResult'>
                {activeReading === 'Western' && <WesternZodiac />}
                {activeReading === 'Eastern' && <ChineseZodiac />}
            </div>
        </div>
    );
}

export default ZodiacPage
