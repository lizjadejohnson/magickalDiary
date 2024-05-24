import { useState } from 'react';

const CreateForm = ({ setNotes }) => {
    const [createForm, setCreateForm] = useState({ title: '', body: '' });

    function handleChange(event) {
      setCreateForm({
        ...createForm,
        [event.target.name]: event.target.value
      })
    }
  
    async function handleSubmit(event) {
      event.preventDefault()
      try {
        const response = await fetch('http://localhost:3000/notes', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Include credentials (cookies)
          body: JSON.stringify(createForm)
        });
        const data = await response.json();
        if (data && data.note) {
        setNotes(previousNotes => [...previousNotes, data.note]);
        } else {
        // Handle unexpected response structure:
        console.error("Unexpected response structure:", data);
        }
        setCreateForm({ title: '', body: '' }) //  <-- Reset form fields
      } catch(error) {
        console.error(error)
      }
    }
  
    return (
      <div className='createform'>
        <h1>Create Note</h1>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='title'
            placeholder='Note Title'
            value={createForm.title}
            onChange={handleChange}
          /><br />
          <textarea
            name='body'
            cols='50' rows='5'
            placeholder='Note Body'
            value={createForm.body}
            onChange={handleChange}
          /><br />
          <button type='submit'>Create</button>
        </form>
      </div>
    );
  }

export default CreateForm
