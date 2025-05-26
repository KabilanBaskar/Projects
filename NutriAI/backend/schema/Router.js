const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/allocate', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5002/allocate', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Allocation failed' });
  }
});

module.exports = router;