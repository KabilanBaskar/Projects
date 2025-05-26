import React, { useState } from 'react';

// This should ideally come from props, context, or be shared between pages
const weeklyMenu = [
  {
    day: 'Monday',
    breakfast: 'Idli',
    lunch: 'Sambar',
    dinner: 'Curd Rice',
    totalNutrition: { calories: 500, protein: 20, carbs: 60, fat: 15 }
  },
  {
    day: 'Tuesday',
    breakfast: 'Dosa',
    lunch: 'Pongal',
    dinner: 'Parotta',
    totalNutrition: { calories: 600, protein: 22, carbs: 65, fat: 18 }
  },
  {
    day: 'Wednesday',
    breakfast: 'Upma',
    lunch: 'Tomato Rice',
    dinner: 'Rotti',
    totalNutrition: { calories: 550, protein: 21, carbs: 62, fat: 17 }
  },
  {
    day: 'Thursday',
    breakfast: 'Idli',
    lunch: 'Sambar',
    dinner: 'Curd Rice',
    totalNutrition: { calories: 500, protein: 20, carbs: 60, fat: 15 }
  },
  {
    day: 'Friday',
    breakfast: 'Dosa',
    lunch: 'Lemon Rice',
    dinner: 'Kali',
    totalNutrition: { calories: 580, protein: 23, carbs: 64, fat: 16 }
  },
  {
    day: 'Saturday',
    breakfast: 'Upma',
    lunch: 'Pongal',
    dinner: 'Thayir Sadam',
    totalNutrition: { calories: 560, protein: 22, carbs: 63, fat: 15 }
  },
  {
    day: 'Sunday',
    breakfast: 'Porridge',
    lunch: 'Tamarind Rice',
    dinner: 'Parotta',
    totalNutrition: { calories: 570, protein: 24, carbs: 65, fat: 17 }
  },
];

export default function TrackPage() {
  const [completedMeals, setCompletedMeals] = useState({});
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !selectedDay || !selectedMealType) return;

    // Fake analysis: mark that meal as completed
    setCompletedMeals(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [selectedMealType]: true
      }
    }));
  };

  return (
    <div className="container">
      <h1>Track Your Meals</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Select Day:
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
            <option value="">-- Select Day --</option>
            {weeklyMenu.map((entry) => (
              <option key={entry.day} value={entry.day}>{entry.day}</option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Select Meal:
          <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
            <option value="">-- Select Meal --</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </label>
      </div>

      <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} />

      <h2>Weekly Menu</h2>
      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
            <th>Total Calories</th>
            <th>Total Protein</th>
            <th>Total Carbs</th>
            <th>Total Fat</th>
          </tr>
        </thead>
        <tbody>
          {weeklyMenu.map((entry) => (
            <tr key={entry.day}>
              <td>{entry.day}</td>
              <td>
                {entry.breakfast}
                {completedMeals[entry.day]?.breakfast && ' ✅'}
              </td>
              <td>
                {entry.lunch}
                {completedMeals[entry.day]?.lunch && ' ✅'}
              </td>
              <td>
                {entry.dinner}
                {completedMeals[entry.day]?.dinner && ' ✅'}
              </td>
              <td>{entry.totalNutrition.calories}</td>
              <td>{entry.totalNutrition.protein}</td>
              <td>{entry.totalNutrition.carbs}</td>
              <td>{entry.totalNutrition.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
