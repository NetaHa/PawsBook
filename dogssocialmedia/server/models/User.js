const fs = require('fs');
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // Import the UUID function
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

class User {
  static dbPath = path.join(__dirname, "data", "users.json");

  static async findOne(query) {
    const users = await readJsonAsync(User.dbPath);

    const isMatch = (user) => {
      return Object.keys(query).every(key => user[key] === query[key]);
    }

    const user = users.find(isMatch);
    return user;
  }

  static async create(user) {
    const users = await readJsonAsync(User.dbPath);

    // Assign a unique ID to the user
    user.id = uuidv4();

    // Hash the password before saving
    user.password = await bcrypt.hash(user.password, saltRounds);

    user.activityHistory = [{ 
      event: 'Registered',  
      timestamp: new Date().toISOString()
    }];

    user.following = [];
    user.followers = [];

    users.push(user);
    await writeJsonAsync(User.dbPath, users);
  }

  static async validatePassword(inputPassword, storedPassword) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  static async findById(userId) {
    const users = await readJsonAsync(User.dbPath);
    return users.find(user => user.id === userId);
  }
  static async addFollower(userId, followerId) {
    const users = await readJsonAsync(User.dbPath);
    const user = users.find(u => u.id === userId);
    if (user) {
        user.followers.push(followerId);
        await writeJsonAsync(User.dbPath, users);
    }
}

static async removeFollower(userId, followerId) {
    const users = await readJsonAsync(User.dbPath);
    const user = users.find(u => u.id === userId);
    if (user) {
        user.followers = user.followers.filter(id => id !== followerId);
        await writeJsonAsync(User.dbPath, users);
    }
}
static async update(updatedUser) {
  const users = await readJsonAsync(User.dbPath);
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
      users[index] = updatedUser;
      await writeJsonAsync(User.dbPath, users);
  }
}// last function i added 21:18

  static generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

  const secret = process.env.JWT_SECRET || 'YOUR_FALLBACK_SECRET_KEY';
  const options = {
      expiresIn: '1h'
    };

    return jwt.sign(payload, secret, options);
  }
}

const readJsonAsync = (path) => {
  return new Promise((resolve, reject) => fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(data));
    }
  }));
}

const writeJsonAsync = (path, data) => {
  return new Promise((resolve, reject) => fs.writeFile(path, JSON.stringify(data, null, 2), { encoding: "utf8", flag: "w" }, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  }));
}

module.exports = { User, readJsonAsync };

