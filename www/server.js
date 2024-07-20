const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const flash = require('express-flash');
const fs = require('fs').promises;

dotenv.config();

const app = express();
const port = process.env.PORT || 3306;

app.use(session({
  secret: process.env.SESSION_SECRET || 'w7IkD3AY4auX7DsoH9EFtRHXqpYWPZ0iNwsZVp5xhEGnNl8v9MSJUDXbiUjTKd0lsa',
  resave: false,
  saveUninitialized: false
}));

const pool = mysql.createPool({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
});

const connectToDatabase = async () => {

  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

process.on('SIGINT', () => {
  console.log('Received SIGINT. Closing server gracefully.');
  app.close(() => {
    pool.end((err) => {
      if (err) {
        console.error('Error closing database pool:', err);
      } else {
        console.log('Database pool closed.');
      }
      process.exit(0);
    });
  });
});

const sqlDirectory = path.join(__dirname, 'sql');

async function loadQuery(queryName) {
  const queryPath = path.join(sqlDirectory, `${queryName}.sql`);
  return fs.readFile(queryPath, 'utf-8');
}

const usersDirectory = path.join(__dirname, 'users');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'www/public/uploads/profile');
  },
  filename: (req, file, cb) => {
    const username = req.user.username;
    cb(null, `${username}_profile_pic.jpg`);
  },
});

const upload = multer({ storage: storage });

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.post('/user/profile/picture', isAuthenticated, upload.single('profilePic'), async (req, res) => {
  try {
    const username = req.user.username;
    const profilePicUrl = `public/uploads/profile/${req.file.filename}`;
    const updateProfilePicQuery = 'UPDATE users SET profilePic = ? WHERE id = ?';
    await pool.query(updateProfilePicQuery, [profilePicUrl, username]);
    res.json({ success: true, message: 'Profile picture updated successfully', profilePic: profilePicUrl });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ success: false, message: 'Error updating profile picture' });
  }
});

app.get('/user/profile', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const [results] = await pool.query('SELECT username, email, profilePic, about FROM users WHERE id = ?', [userId]);
    if (results.length > 0) {
      const userProfile = results[0];
      if (!userProfile.about) {
        try {
          const profileText = await fs.readFile(path.join(__dirname, 'public', 'ProfileText.txt'), 'utf-8');
          userProfile.about = profileText;
        } catch (fileError) {
          console.error('Error reading ProfileText.txt:', fileError);
          userProfile.about = '';
        }
      }
      res.json(userProfile);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/profile', isAuthenticated, async (req, res) => {
  const username = req.user.username;
  try {
    const queryPath = path.join(__dirname, 'sql', 'fetch_profile.sql');
    const query = await fs.readFile(queryPath, 'utf-8');
    const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (results.length > 0) {
      res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/user/profile', isAuthenticated, upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, about } = req.body;
    const profilePic = req.file ? `uploads/profile/${req.file.filename}` : null;

    const updateFields = [];
    const updateValues = [];

    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (about) {
      updateFields.push('about = ?');
      updateValues.push(about);
    }
    if (profilePic) {
      updateFields.push('profilePic = ?');
      updateValues.push(profilePic);
    }

    updateValues.push(userId);

    if (updateFields.length > 0) {
      const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      await pool.query(updateQuery, updateValues);
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      console.log('Passport strategy:- Starting authentication');

      let connection;
      try {
        connection = await connectToDatabase();
        console.log('Passport strategy: Connected to database');
      } catch (dbConnectError) {
        console.error('Passport strategy: Failed to connect to database', dbConnectError);
        return done(new Error('Failed to connect to database'));
      }

      let results;
      try {
        [results] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
      } catch (queryError) {
        console.error('Passport strategy: Error executing query', queryError);
        connection.release();
        return done(queryError);
      }

      connection.release();
      console.log('Database query results:', results);

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Incorrect password');
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const connection = await connectToDatabase();
    const [results] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    connection.release();
    if (results.length === 0) {
      return done(new Error('User not found'));
    }
    const user = results[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/landing-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'games.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'LoginPage.html'));
});

app.get('/user-profile', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/edit-profile', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'EditProfile.html'));
});

app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/login'); // Redirect to the login page
    });
  });
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const connection = await connectToDatabase();
    const hashedPassword = await hashPassword(password);
    const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await connection.query(insertUserQuery, [username, email, hashedPassword]);
    console.log('User registered successfully!');
    connection.release();
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('An error occurred during registration.');
  }
});

app.post('/api/login', (req, res, next) => {
  console.log('Step 1!');
  console.log('Request body:', req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log('Step 2 Error!');
      return next(err);
    }
    if (!user) {
      console.log('Step 2 notUser!');
      return res.redirect('/login');
    }
    console.log('Step 2!');
    req.logIn(user, (err) => {
      console.log('Step 3 Login!');
      if (err) {
        return next(err);
      }
      console.log('Step 3!');
      return res.redirect('/');
    });
  })(req, res, next);
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
