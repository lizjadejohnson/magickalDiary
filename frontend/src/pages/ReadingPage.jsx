import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../utilities/UserContext';
import Spinner from '../components/Spinner';
import apiUrl from '../config';
import CommentEditSection from '../components/CommentEditSection';
import HexagramReading from '../components/HexagramReading';
import TextDiaryEntryDisplay from '../components/TextDiaryEntryDisplay';
// import TarotReading from '../components/TarotReading'; 
// import TextEntry from '../components/TextEntry'; 

//This is an all purpose readings page. We get redirected here using the reading ID
//E.g. in the HexagramReading we have:
    // const savedEntry = await saveAsDiaryEntry('I Ching', newReading);
    // if (savedEntry) {
    // navigate(`/reading/${savedEntry._id}`);

const ReadingPage = () => {
    //Get ID param off the url:
    const { id } = useParams();
    const [entryData, setEntryData] = useState(null);
    const [loading, setLoading] = useState(true);

    //For editing/commenting:
    const [showEdit, setShowEdit] = useState(false);
    const [updateForm, setUpdateForm] = useState({ _id: null, question: '', commentary: '', tags: '' });

    const { user } = useContext(UserContext);


    //useEffect: Take the id and call fetchReading. This makes a get request to our diary entries using the ID.
    useEffect(() => {
        fetchReading();
    }, [id]);


    const fetchReading = async () => {
        try {
            const response = await fetch(`${apiUrl}/diaryEntries/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            
            //Save all the data from the diaryEntry to state:
            setEntryData(data.diaryEntry);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching reading:', error);
            setLoading(false);
        }
    };

    // If someone is not logged in:
    if (!user) {
        return (
            <Spinner redirectTo={"/"} delay={5000} message={"You must first login or create a new account. Redirecting to homepage..."} />
        );
    };

    if (loading) {
        return <Spinner message={"Loading reading..."} />;
    }

    //For editing:
    const handleEditClick = () => {
        setUpdateForm({
            _id: entryData._id,
            question: entryData.details.question,
            commentary: entryData.commentary, 
            tags: entryData.tags.join(', '),
        });
        setShowEdit(true);
    };

    //After pulling the data from diaryEntries, one thing we'll have on all of them is reading.type.
    //If there is entry data, the type will be like "I Ching" or "Tarot" and it will determine which type of reading component to render
    

    const renderMeaning = (meaning) => {
        return meaning.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ));
      };

    return (
        <div className='readingPage'>
            {entryData && (
                <div className='entry-content-section'>
                    {entryData.type === 'I Ching' && <HexagramReading data={entryData} />}
                    {entryData.type === 'Text' && <TextDiaryEntryDisplay data={entryData} />}
                    {/* {entryData.type === 'Tarot' && <TarotReading data={entryData} />}
                    {entryData.type === 'Text' && <TextEntry data={entryData} />} */}
                </div>
            )}
            <div className='entry-edit-section'>
                {showEdit ? (
                    <CommentEditSection
                        showEdit={showEdit}
                        setShowEdit={setShowEdit}
                        updateForm={updateForm}
                        setUpdateForm={setUpdateForm}
                        updateEntry={entryData}
                        setEntryData={setEntryData}
                    />
                ) : (
                    <>
                        <p><span className='bold'>User Commentary:</span> {renderMeaning(entryData.commentary) ? renderMeaning(entryData.commentary) : "No commentary has been added to this entry yet."}</p>
                        <p><span className='bold'>Tags:</span> {entryData.tags.length > 0 ? entryData.tags.join(', ') : "No tags yet."}</p>
                        <p><span className='bold'>Last Updated:</span> {new Date(entryData.updatedAt).toLocaleString()}</p>
                        <button onClick={handleEditClick}>Edit/Comment/Delete</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReadingPage;
