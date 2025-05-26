import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tamilDishes = [
  'Chappathi', 'Rotti', 'Kali', 'Parotta', 'Curd Rice', 'Pongal',
  'Tomato Rice', 'Idli', 'Dosa', 'Upma', 'Lemon Rice',
  'Tamarind Rice', 'Palaya Sadham', 'Porridge', 'Thayir Sadam'
];

const getRandomDish = () => tamilDishes[Math.floor(Math.random() * tamilDishes.length)];

const generateRandomWeeklyMenu = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => {
    const breakfast = getRandomDish();
    const lunch = getRandomDish();
    const dinner = getRandomDish();
    return {
      day,
      breakfast,
      lunch,
      dinner,
      totalNutrition: {
        calories: Math.floor(Math.random() * 400 + 300),
        protein: Math.floor(Math.random() * 20 + 10),
        carbs: Math.floor(Math.random() * 60 + 40),
        fat: Math.floor(Math.random() * 20 + 10),
      }
    };
  });
};

const getRandomRecommendations = (count = 3) => {
  const shuffled = [...tamilDishes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (username === '' || password === '') {
      setError('Please enter both username and password.');
      return;
    }

    // Simulate successful login
    const weeklyMenu = generateRandomWeeklyMenu();
    const recommendedDishes = getRandomRecommendations();

    navigate('/table', {
      state: {
        weeklyMenu,
        selectedDishes: [],
        recommendedDishes
      }
    });
  };

  return (
    <div className="login-container">
      <h2>Login to NutriAI</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
