import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TablePage = () => {
  const location = useLocation();
  const { weeklyMenu } = location.state || {}; // Get weekly menu from state
  const { selectedDishes } = location.state || {}; // Get selected dishes from state
  const navigate = useNavigate();
  if (!weeklyMenu) {
    return <p>No weekly menu found. Please generate a weekly menu first.</p>;
  }
  const handleTrack = () => {
    navigate('/track'); // Navigate to the Track Page when the button is clicked
  };
  return (
    <div className="container">
      <h1>Weekly Menu</h1>
      <h2>Selected Dishes</h2>
      {selectedDishes && selectedDishes.length > 0 ? (
        <ul>
          {selectedDishes.map((dish, i) => (
            <li key={i}>{dish}</li>
          ))}
        </ul>
      ) : (
        <p>No dishes selected.</p>
      )}

      <table>
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
          {weeklyMenu.map((day, i) => (
            <tr key={i}>
              <td>{day.day}</td>
              <td>{day.breakfast}</td>
              <td>{day.lunch}</td>
              <td>{day.dinner}</td>
              <td>{day.totalNutrition.calories}</td>
              <td>{day.totalNutrition.protein}</td>
              <td>{day.totalNutrition.carbs}</td>
              <td>{day.totalNutrition.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="track-button" onClick={handleTrack}>
        Track
      </button>
    </div>
  );
};

export default TablePage;
