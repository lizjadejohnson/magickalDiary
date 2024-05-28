import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import HexagramReading from '../components/HexagramReading';
// import TarotReading from '../components/TarotReading'; 
// import TextEntry from '../components/TextEntry'; 

const ReadingPage = () => {
    const { id } = useParams();
    const [reading, setReading] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReading();
    }, [id]);

    const fetchReading = async () => {
        try {
            const response = await fetch(`http://localhost:3000/diaryEntries/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            
            setReading(data.diaryEntry);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reading:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner message={"Loading reading..."} />;
    }

    return (
        <div className='readingPage'>
            {reading && (
                <>
                    {reading.type === 'I Ching' && <HexagramReading data={reading} />}
                    {/* {reading.type === 'Tarot' && <TarotReading data={reading.details} />}
                    {reading.type === 'Text' && <TextEntry data={reading.details} />} */}
                </>
            )}
        </div>
    );
};

export default ReadingPage;
