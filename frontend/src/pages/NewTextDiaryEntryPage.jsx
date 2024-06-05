import { useState, useContext } from 'react';
import { UserContext } from '../../utilities/UserContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import apiUrl from '../config';
import {saveAsDiaryEntry} from '../../utilities/saveAsDiaryEntry';

const NewTextDiaryEntryPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [entry, setEntry] = useState({
        question: '',
        commentary: '',
        tags: ''
    });

    if (!user) {
        return <Spinner redirectTo={'/'} delay={5000} message={"You must first login or create a new account. Redirecting to homepage..."} />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEntry(prevEntry => ({
            ...prevEntry,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const details = {
            question: entry.question,
        };
        const commentary = entry.commentary;
        const tags = entry.tags.split(',').map(tag => tag.trim()); // Convert tags from string to array separated at the comma

        try {
            const savedEntry = await saveAsDiaryEntry("Text", details, commentary, tags);
            if (savedEntry) {
                navigate(`${apiUrl}/reading/${savedEntry._id}`);
            } else {
                throw new Error('Failed to navigate to diary entry');
            }
        } catch (error) {
            console.error('Error handling the diary entry submission:', error);
        }
    };

    return (
        <div className='comment-edit-section'>
            <h1>Create New Entry</h1>
            <p className="text-tip" style={{textAlign: "center"}}>Perfect for use as a dream journal, jotting down reflections from a meditation session, or whatever suits your need.</p>
            <form onSubmit={handleSubmit} className='diaryEntry-edit-form'>
                <div>
                    <h3>Title/Question/Meditation:</h3>
                    <input
                        type="text"
                        name="question"
                        value={entry.question}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <h3>User Commentary:</h3>
                    <textarea
                        name="commentary"
                        value={entry.commentary}
                        cols='20' rows='20'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <h3>Tags:</h3>
                    <p className="text-tip">Tags are comma separated!</p>
                    <input
                        type="text"
                        name="tags"
                        value={entry.tags}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <button type="submit">Create Entry</button>
            </form>
        </div>
    );
};

export default NewTextDiaryEntryPage;