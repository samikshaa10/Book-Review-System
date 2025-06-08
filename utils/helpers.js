// Function to calculate average rating for a book
const calculateAverageRating = async (bookId) => {
  const Review = require('D:\\node\\book-review-api\\models\\Review.js'); // Import here to avoid circular dependency
  const Book = require('D:\\node\\book-review-api\\models\\Book.js');

  const stats = await Review.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: stats[0].averageRating,
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      numOfReviews: 0,
    });
  }
};

module.exports = {
  calculateAverageRating,
};