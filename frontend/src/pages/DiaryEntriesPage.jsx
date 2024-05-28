import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';



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
            const response = await fetch('http://localhost:3000/diaryEntries', {
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
                                <p>Type: {entry.type}</p>
                                <p>Timestamp: {new Date(entry.createdAt).toLocaleString()}</p>
                                <p>Tags: {entry.tags.join(', ')}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiaryEntriesPage;
