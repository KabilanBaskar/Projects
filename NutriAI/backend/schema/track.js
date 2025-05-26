const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('image'), async (req, res) => {
  const imgPath = req.file.path;

  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imgPath));

    const mlResponse = await axios.post('http://localhost:5003/analyze', formData, {
      headers: formData.getHeaders()
    });

    fs.unlinkSync(imgPath);
    res.json(mlResponse.data);
  } catch (err) {
    res.status(500).json({ error: 'Image analysis failed' });
  }
});

module.exports = router;