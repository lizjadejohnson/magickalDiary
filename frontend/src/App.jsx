import { useState, useEffect } from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Navbar from './components/Navbar';
import NotesPage from './pages/NotesPage'
import SignUpPage from './pages/SignUpPage';
import AboutPage from './pages/AboutPage';
import EditProfilePage from './pages/EditProfilePage';
import HeroImage from './components/HeroImage';
import ZodiacPage from './pages/ZodiacPage';
import IChingPage from './pages/IChingPage';
import DiaryEntriesPage from './pages/DiaryEntriesPage';
import ReadingPage from './pages/ReadingPage';
import NewTextDiaryEntryPage from './pages/NewTextDiaryEntryPage';
import TarotPage from './pages/tarotPage';

function App() {


  //------------------------------------------[State]-----------------------------------------------------



  //------------------------------------------[CRUD Operations]-------------------------------------------



  return (
    <>
      <div className='App'>
          <Navbar />
          <div className='MainContent'>
            <Routes>
              <Route path="/" element={<HeroImage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/zodiac" element={<ZodiacPage />} />
              <Route path="/iching" element={<IChingPage />} />
              <Route path="/tarot" element={<TarotPage />} />
              <Route path="/text-entry" element={<NewTextDiaryEntryPage />} />
              <Route path="/reading/:id" element={<ReadingPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/diary-entries" element={<DiaryEntriesPage />} />
            </Routes>
          </div>
      </div>
    </>
  );
}

export default App;