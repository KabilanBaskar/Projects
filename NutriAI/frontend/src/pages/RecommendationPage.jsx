import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecommendationPage() {
  const navigate = useNavigate();
  
  const tamilDishes = [
    { id: 1, name: 'chappathi' },
    { id: 2, name: 'Rotti' },
    { id: 3, name: 'Kali' },
    { id: 4, name: 'Parotta' },
    { id: 5, name: 'Curd Rice' },
    { id: 6, name: 'Pongal' },
    { id: 7, name: 'tomato rice' },
    { id: 8, name: 'Idli' },
    { id: 9, name: 'Dosa' },
    { id: 10, name: 'Upma' },
    { id: 11, name: 'Lemon Rice' },
    { id: 12, name: 'Tamarind Rice' },
    { id: 13, name: 'palaya sadham' },
    { id: 14, name: 'pordridge' },
    { id: 15, name: 'Thayir Sadam' }
  ];

  // Nutritional values for each dish
  const dishNutrition = {
    'chappathi': { calories: 120, protein: 3, carbs: 22, fat: 2 },
    'Rotti': { calories: 150, protein: 4, carbs: 30, fat: 3 },
    'Kali': { calories: 200, protein: 5, carbs: 40, fat: 5 },
    'Parotta': { calories: 250, protein: 5, carbs: 45, fat: 8 },
    'Curd Rice': { calories: 200, protein: 6, carbs: 40, fat: 5 },
    'Pongal': { calories: 180, protein: 4, carbs: 35, fat: 4 },
    'tomato rice': { calories: 220, protein: 5, carbs: 45, fat: 6 },
    'Idli': { calories: 80, protein: 2, carbs: 15, fat: 1 },
    'Dosa': { calories: 150, protein: 3, carbs: 25, fat: 4 },
    'Upma': { calories: 200, protein: 5, carbs: 35, fat: 6 },
    'Lemon Rice': { calories: 210, protein: 4, carbs: 45, fat: 5 },
    'Tamarind Rice': { calories: 220, protein: 5, carbs: 50, fat: 5 },
    'palaya sadham': { calories: 250, protein: 6, carbs: 50, fat: 7 },
    'pordridge': { calories: 180, protein: 4, carbs: 35, fat: 3 },
    'Thayir Sadam': { calories: 150, protein: 4, carbs: 30, fat: 3 }
  };

  const [selected, setSelected] = useState([]);
  const [recommendedDishes, setRecommendedDishes] = useState([]);
  
  const dailyRequirements = {
    calories: 2000,
    protein: 60,
    carbs: 300,
    fat: 70
  };

  const toggleDish = (dish) => {
    if (selected.includes(dish.name)) {
      setSelected(selected.filter((d) => d !== dish.name));
    } else {
      setSelected([...selected, dish.name]);
    }
  };

  // Function to calculate the total nutritional value for selected dishes
  const calculateTotalNutritionalValue = (selectedDishes) => {
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
    selectedDishes.forEach(dish => {
      const nutrition = dishNutrition[dish];
      if (nutrition) {  // Check if the nutrition data exists for the dish
        total.calories += nutrition.calories;
        total.protein += nutrition.protein;
        total.carbs += nutrition.carbs;
        total.fat += nutrition.fat;
      } else {
        console.warn(`Nutrition data missing for dish: ${dish}`);
      }
    });
  
    return total;
  };
  
  const generateWeeklyMenu = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return daysOfWeek.map((day) => {
      const randomBreakfast = selected[Math.floor(Math.random() * selected.length)];
      const randomLunch = selected[Math.floor(Math.random() * selected.length)];
      const randomDinner = selected[Math.floor(Math.random() * selected.length)];

      // Calculate total nutritional value for the selected day's menu
      const totalNutrition = calculateTotalNutritionalValue([randomBreakfast, randomLunch, randomDinner]);

      return { 
        day,
        breakfast: randomBreakfast, 
        lunch: randomLunch, 
        dinner: randomDinner,
        totalNutrition
      };
    });
  };

  const handleSave = () => {
    const weeklyMenu = generateWeeklyMenu(); // Generate the weekly menu
    navigate('/table', { state: { selectedDishes: selected, weeklyMenu } });
  };
  
  const recommendFood = () => {
    // Get the unselected dishes by filtering out the selected ones
    const unselectedDishes = tamilDishes.filter(dish => !selected.includes(dish.name));

    // Pick 3 random dishes from the unselected ones
    const randomRecommendations = [];
    for (let i = 0; i < 3; i++) {
      const randomDish = unselectedDishes[Math.floor(Math.random() * unselectedDishes.length)];
      if (!randomRecommendations.includes(randomDish.name)) {
        randomRecommendations.push(randomDish.name);
      }
    }

    setRecommendedDishes(randomRecommendations);
  };

  return (
    <div className="container">
      <h1>Tamil Nadu Traditional Dishes</h1>
      <div className="grid">
        {tamilDishes.map((dish) => (
          <div
            key={dish.id}
            className={`card ${selected.includes(dish.name) ? 'selected' : ''}`}
            onClick={() => toggleDish(dish)}
          >
            {dish.name}
          </div>
        ))}
      </div>

      <div className="summary">
        <h2>Selected Dishes</h2>
        {selected.length ? (
          <ul>{selected.map((name, i) => <li key={i}>{name}</li>)}</ul>
        ) : (
          <p>No dishes selected.</p>
        )}
      </div>

      <button className="recommend-button" onClick={recommendFood}>
        Recommend Food
      </button>

      <div className="recommendations">
        {recommendedDishes.length > 0 && (
          <>
            <h2>Recommended Dishes</h2>
            <ul>
              {recommendedDishes.map((dish, i) => (
                <li key={i}>{dish}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
