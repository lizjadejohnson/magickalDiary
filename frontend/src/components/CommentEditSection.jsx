import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../config';


const CommentEditSection = ({ showEdit, setShowEdit, updateForm, setUpdateForm, updateEntry, setEntryData }) => {

    const navigate = useNavigate();

    const handleChange = (event) => {
        setUpdateForm({
            ...updateForm,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitting form data:', updateForm);
        try {
            const response = await fetch(`${apiUrl}/diaryEntries/${updateEntry._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(updateForm)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update diary entry');
            }

            console.log('Updated diary entry:', data.diaryEntry);

            //Needing to spread so that we can access the top level commentary & tags as well as lower level details > question and not edit other parts!
            setEntryData(prevEntry => ({
                ...prevEntry,
                details: {
                    ...prevEntry.details,
                    question: updateForm.question,
                },
                commentary: updateForm.commentary,
                tags: updateForm.tags.split(',').map(tag => tag.trim()),
                updatedAt: data.diaryEntry.updatedAt
            }));

            setUpdateForm({
                _id: null,
                question: '',
                commentary: '',
                tags: ''
            });

            setShowEdit(false);

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleClose = (event) => {
        event.preventDefault();
        setShowEdit(false);
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this entry?");

        if (confirmed) {
            try {
                const response = await fetch(`{apiUrl/notes}/diaryEntries/${updateEntry._id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to delete diary entry');
                }

                console.log('Deleted diary entry:', data.diaryEntry);
                navigate('/diary-entries');

            } catch (error) {
                console.error('Error deleting diary entry:', error);
            }
        }
    };


    return (
        <>
            {showEdit && (
                <div className='comment-edit-section'>
                    <h1>Edit Entry</h1>
                    <form onSubmit={handleSubmit} className='diaryEntry-edit-form'>
                        <div>
                            <p className="text-tip">Edit Question/Meditation/Title:</p>
                            <input
                                type='text'
                                name='question'
                                placeholder='Question/Meditation/Title'
                                value={updateForm.question}
                                onChange={handleChange}
                            />
                        </div>
                        <br />
                        <div>
                            <p className="text-tip">User commentary:</p>
                            <textarea
                                name='commentary'
                                cols='20' rows='20'
                                placeholder='User Commentary'
                                value={updateForm.commentary}
                                onChange={handleChange}
                            />
                        </div>
                        <br />
                        <div>
                            <p className="text-tip">Tags are comma separated:</p>
                            <input
                                type='text'
                                name='tags'
                                placeholder='Add custom tags'
                                value={updateForm.tags}
                                onChange={handleChange}
                            />
                        </div>
                        <br />

                        <div className="button-container">
                            <button type='submit'>Update</button>
                            <button onClick={handleClose}>Cancel</button>
                            <button onClick={handleDelete} className='delete-button'>Delete</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default CommentEditSection;
