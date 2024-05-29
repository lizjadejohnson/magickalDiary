import React from 'react'
import { Link } from 'react-router-dom';

const HeroImage = () => {
  return (
    <div className="hero-image">
        <div className="hero-text">
            <h1>Magickal Diary</h1>
            <p>Welcome to your magickal diary</p>
            <Link to="/diary-entries"><button id="hero-button">Go to Your Entries</button></Link>
        </div>
    </div>
  )
}

export default HeroImage
