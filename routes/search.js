const express = require('express');
const Book = require('D:/node/book-review-api/models/Book.js');

const router = express.Router();

// @route   GET /api/search
// @desc    Search books by title or author (partial and case-insensitive)
// @access  Public
router.get('/', async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query; // 'q' for query
  const skip = (page - 1) * limit;

  if (!q) {
    return res.status(400).json({ message: 'Search query (q) is required' });
  }

  try {
    const searchRegex = new RegExp(q, 'i'); // Case-insensitive partial match

    const query = {
      $or: [
        { title: searchRegex },
        { author: searchRegex },
      ],
    };

    const books = await Book.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ title: 1 }); // Sort by title

    const totalResults = await Book.countDocuments(query);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
      books,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;