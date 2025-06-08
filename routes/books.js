// const express = require('express');
// const { check, validationResult } = require('express-validator');
// const protect = require('D:/node/book-review-api/middlewares/auth.js');
// const Book = require('D:/node/book-review-api/models/Book.js');

// const router = express.Router();

// // @route   POST /api/books
// // @desc    Add a new book
// // @access  Private (Authenticated users only)
// router.post(
//   '/',
//   protect,
//   [
//     check('title', 'Title is required').not().isEmpty(),
//     check('author', 'Author is required').not().isEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { title, author, genre, publicationYear, description } = req.body;

//     try {
//       const newBook = new Book({
//         title,
//         author,
//         genre,
//         publicationYear,
//         description,
//       });

//       const book = await newBook.save();
//       res.status(201).json({ message: 'Book added successfully', book });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   GET /api/books
// // @desc    Get all books with pagination and optional filters
// // @access  Public
// router.get('/', async (req, res) => {
//   const { page = 1, limit = 10, author, genre } = req.query;
//   const skip = (page - 1) * limit;

//   let query = {};
//   if (author) {
//     query.author = new RegExp(author, 'i'); // Case-insensitive partial match
//   }
//   if (genre) {
//     query.genre = new RegExp(genre, 'i'); // Case-insensitive partial match
//   }

//   try {
//     const books = await Book.find(query)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort({ createdAt: -1 }); // Sort by creation date (latest first)

//     const totalBooks = await Book.countDocuments(query);

//     res.json({
//       page: parseInt(page),
//       limit: parseInt(limit),
//       totalPages: Math.ceil(totalBooks / limit),
//       totalBooks,
//       books,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET /api/books/:id
// // @desc    Get book details by ID, including average rating and reviews
// // @access  Public
// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { page = 1, limit = 5 } = req.query; // Pagination for reviews
//   const skip = (page - 1) * limit;

//   try {
//     const book = await Book.findById(id);

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     const reviews = await Review.find({ book: id })
//       .populate('user', 'username') // Populate user details (only username)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort({ createdAt: -1 });

//     const totalReviews = await Review.countDocuments({ book: id });

//     res.json({
//       book,
//       reviews: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(totalReviews / limit),
//         totalReviews,
//         list: reviews,
//       },
//     });
//   } catch (error) {
//     console.error(error.message);
//     if (error.kind === 'ObjectId') {
//       return res.status(400).json({ message: 'Invalid Book ID' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;


// // const express = require('express');
// // const { check, validationResult } = require('express-validator');
// // const protect = require('D://node//book-review-api//middlewares');
// // const Book = require('D://node//book-review-api//models//Book.js');
// // const Review = require('D://node//book-review-api//models//Review.js'); // Add this line to import the Review model

// // const router = express.Router();

// // // @route   POST /api/books
// // // @desc    Add a new book
// // // @access  Private (Authenticated users only)
// // router.post(
// //   '/',
// //   protect,
// //   [
// //     check('title', 'Title is required').not().isEmpty(),
// //     check('author', 'Author is required').not().isEmpty(),
// //   ],
// //   async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ errors: errors.array() });
// //     }

// //     const { title, author, genre, publicationYear, description } = req.body;

// //     try {
// //       const newBook = new Book({
// //         title,
// //         author,
// //         genre,
// //         publicationYear,
// //         description,
// //       });

// //       const book = await newBook.save();
// //       res.status(201).json({ message: 'Book added successfully', book });
// //     } catch (error) {
// //       console.error(error.message);
// //       res.status(500).send('Server error');
// //     }
// //   }
// // );

// // // @route   GET /api/books
// // // @desc    Get all books with pagination and optional filters
// // // @access  Public
// // router.get('/', async (req, res) => {
// //   const { page = 1, limit = 10, author, genre } = req.query;
// //   const skip = (page - 1) * limit;

// //   let query = {};
// //   if (author) {
// //     query.author = new RegExp(author, 'i'); // Case-insensitive partial match
// //   }
// //   if (genre) {
// //     query.genre = new RegExp(genre, 'i'); // Case-insensitive partial match
// //   }

// //   try {
// //     const books = await Book.find(query)
// //       .limit(parseInt(limit))
// //       .skip(skip)
// //       .sort({ createdAt: -1 }); // Sort by creation date (latest first)

// //     const totalBooks = await Book.countDocuments(query);

// //     res.json({
// //       page: parseInt(page),
// //       limit: parseInt(limit),
// //       totalPages: Math.ceil(totalBooks / limit),
// //       totalBooks,
// //       books,
// //     });
// //   } catch (error) {
// //     console.error(error.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// // // @route   GET /api/books/:id
// // // @desc    Get book details by ID, including average rating and reviews
// // // @access  Public
// // router.get('/:id', async (req, res) => {
// //   const { id } = req.params;
// //   const { page = 1, limit = 5 } = req.query; // Pagination for reviews
// //   const skip = (page - 1) * limit;

// //   try {
// //     const book = await Book.findById(id);

// //     if (!book) {
// //       return res.status(404).json({ message: 'Book not found' });
// //     }

// //     // This is where the Review model was missing
// //     const reviews = await Review.find({ book: id })
// //       .populate('user', 'username') // Populate user details (only username)
// //       .limit(parseInt(limit))
// //       .skip(skip)
// //       .sort({ createdAt: -1 });

// //     const totalReviews = await Review.countDocuments({ book: id });

// //     res.json({
// //       book,
// //       reviews: {
// //         page: parseInt(page),
// //         limit: parseInt(limit),
// //         totalPages: Math.ceil(totalReviews / limit),
// //         totalReviews,
// //         list: reviews,
// //       },
// //     });
// //   } catch (error) {
// //     console.error(error.message);
// //     if (error.kind === 'ObjectId') {
// //       return res.status(400).json({ message: 'Invalid Book ID' });
// //     }
// //     res.status(500).send('Server error');
// //   }
// // });

// // module.exports = router;





const express = require('express');
const { check, validationResult } = require('express-validator');
// CHANGE THESE TWO LINES to use relative paths:
const protect = require('D:/node/book-review-api/middlewares/auth.js'); // Corrected from absolute path
const Book = require('D:/node/book-review-api/models/Book.js');     // Corrected from absolute path
// ADD THIS LINE to import the Review model, as it's used later in the file:
const Review = require('D:/node/book-review-api/models/Review.js'); // Added missing import and used relative path

const router = express.Router();

// @route   POST /api/books
// @desc    Add a new book
// @access  Private (Authenticated users only)
router.post(
  '/',
  protect,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, genre, publicationYear, description } = req.body;

    try {
      const newBook = new Book({
        title,
        author,
        genre,
        publicationYear,
        description,
      });

      const book = await newBook.save();
      res.status(201).json({ message: 'Book added successfully', book });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET /api/books
// @desc    Get all books with pagination and optional filters
// @access  Public
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const skip = (page - 1) * limit;

  let query = {};
  if (author) {
    query.author = new RegExp(author, 'i'); // Case-insensitive partial match
  }
  if (genre) {
    query.genre = new RegExp(genre, 'i'); // Case-insensitive partial match
  }

  try {
    const books = await Book.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 }); // Sort by creation date (latest first)

    const totalBooks = await Book.countDocuments(query);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      books,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/books/:id
// @desc    Get book details by ID, including average rating and reviews
// @access  Public
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 5 } = req.query; // Pagination for reviews
  const skip = (page - 1) * limit;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // This line will now work because Review is imported
    const reviews = await Review.find({ book: id })
      .populate('user', 'username') // Populate user details (only username)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({ book: id });

    res.json({
      book,
      reviews: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        list: reviews,
      },
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Book ID' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
