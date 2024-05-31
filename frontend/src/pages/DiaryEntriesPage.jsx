import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import apiUrl from '../config';



const DiaryEntriesPage = () => {
    const { user } = useContext(UserContext);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDiaryEntries();
        }
    }, [user]);

    const fetchDiaryEntries = async () => {
        try {
            const response = await fetch(`${apiUrl}/diaryEntries`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            setDiaryEntries(data.diaryEntries);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching diary entries:', error);
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Spinner redirectTo={'/'} delay={5000} message={"You must first login or create a new account. Redirecting to homepage..."} />
        );
    }

    if (loading) {
        return <Spinner message={"Loading diary entries..."} />;
    }

    return (
        <div className='diaryEntriesPage'>
            <h1 className='title'>Past Diary Entries</h1>
            {diaryEntries.length === 0 ? (
                <p>No diary entries found.</p>
            ) : (
                <div>
                    {diaryEntries.map(entry => (
                        <div key={entry._id} className='a-past-diary-entry'>
                            <Link to={`/reading/${entry._id}`}>
                                <p><span className='bold'>Type: </span>{entry.type}</p>
                                <p><span className='bold'>Title/Question/Meditation: </span>{entry.details.question}</p>
                                <p><span className='bold'>Timestamp: </span>{new Date(entry.createdAt).toLocaleString()}</p>
                                <p><span className='bold'>Tags: </span>{entry.tags.join(', ')}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiaryEntriesPage;
