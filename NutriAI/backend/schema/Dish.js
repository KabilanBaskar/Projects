import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecommendationPage.css'; // Include this for custom styles

export default function RecommendationPage() {
  const [dishes, setDishes] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes')
      .then(res => setDishes(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleDish = (dish) => {
    if (selected.includes(dish.name)) {
      setSelected(selected.filter(item => item !== dish.name));
    } else {
      setSelected([...selected, dish.name]);
    }
  };

  return (
    <div className="container">
      <h1>Tamil Nadu Traditional Dishes</h1>
      <div className="grid">
        {dishes.map((dish) => (
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
        <ul>
          {selected.map((name, i) => <li key={i}>{name}</li>)}
        </ul>
      </div>
    </div>
  );
}
