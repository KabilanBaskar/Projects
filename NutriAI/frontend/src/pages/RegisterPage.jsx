import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const healthOptions = ['Blood Pressure', 'Heart Disease', 'Diabetes'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    healthConditions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const healthConditions = checked
        ? [...prev.healthConditions, value]
        : prev.healthConditions.filter(cond => cond !== value);
      return { ...prev, healthConditions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace this with your API endpoint
      const response = await axios.post('http://localhost:5000/signup', formData);

      if (!response.ok) throw new Error('Failed to register');

      alert('Registered successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} required />
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
        
        <div className="checkbox-group">
          <label>Health Conditions:</label>
          {healthOptions.map(option => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                onChange={handleCheckboxChange}
              />
              {option}
            </label>
          ))}
        </div>

        <button type="submit" className="register-button" onClick={(e)=>{navigate("/recommendFood")}}>Register</button>
      </form>
      <p>Already have an Accouunt : <button onClick={()=>{navigate("/login")}}>login</button></p>
    </div>
  );
};

export default RegisterPage;
