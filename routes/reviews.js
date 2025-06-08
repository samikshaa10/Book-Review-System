const express = require('express');
const { check, validationResult } = require('express-validator');
const protect = require('D:/node/book-review-api/middlewares/auth.js');
const Review = require('D:/node/book-review-api/models/Review.js');
const Book = require('D:/node/book-review-api/models/Book.js'); //Needed for average rating update
const { calculateAverageRating } = require('D:/node/book-review-api/utils/helpers.js');

const router = express.Router();

// @route   POST /api/books/:id/reviews
// @desc    Submit a review for a book
// @access  Private (Authenticated users only, one review per user per book)
router.post(
  '/:bookId/reviews',
  protect,
  [
    check('rating', 'Rating is required and must be a number between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment cannot be empty').optional().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // From auth middleware

    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Check if user has already reviewed this book
      const existingReview = await Review.findOne({ book: bookId, user: userId });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this book' });
      }

      const newReview = new Review({
        book: bookId,
        user: userId,
        rating,
        comment,
      });

      const review = await newReview.save();

      // Recalculate average rating for the book
      await calculateAverageRating(bookId);

      res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Book ID' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/reviews/:id
// @desc    Update your own review
// @access  Private
router.put(
  '/:id',
  protect,
  [
    check('rating', 'Rating must be a number between 1 and 5').optional().isInt({ min: 1, max: 5 }),
    check('comment', 'Comment cannot be empty').optional().not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params; // Review ID
    const { rating, comment } = req.body;
    const userId = req.user.id;

    try {
      let review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Ensure the user is the owner of the review
      if (review.user.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this review' });
      }

      // Update fields if provided
      if (rating) review.rating = rating;
      if (comment) review.comment = comment;

      await review.save();

      // Recalculate average rating for the book
      await calculateAverageRating(review.book);

      res.json({ message: 'Review updated successfully', review });
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Review ID' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/reviews/:id
// @desc    Delete your own review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params; // Review ID
  const userId = req.user.id;

  try {
    let review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const bookId = review.book;

    await Review.deleteOne({ _id: id }); // Use deleteOne for clarity

    // Recalculate average rating for the book
    await calculateAverageRating(bookId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Review ID' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;