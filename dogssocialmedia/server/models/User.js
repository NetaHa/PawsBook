const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  
const saltRounds = 10;
const { readData, writeData, USERS_PATH } = require('./persist');
activityHistory = [];

class User {
  static dbPath = path.join(__dirname, "data", "users.json");

  static async findOne(query) {
    const users = await readData(USERS_PATH);

    const isMatch = (user) => {
      return Object.keys(query).every(key => user[key] === query[key]);
    }

    const user = users.find(isMatch);
    return user;
  }

  static async create(user) {
    const users = await readData(USERS_PATH);

    // Assign a unique ID to the user
    user.id = uuidv4();

    // Hash the password before saving
    user.password = await bcrypt.hash(user.password, saltRounds);

    user.following = [];
    user.followers = [];

    users.push(user);
    await writeData(USERS_PATH, users);
  }

  static async validatePassword(inputPassword, storedPassword) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  static async findById(userId) {
    const users = await readData(USERS_PATH);
    return users.find(user => user.id === userId);
  }
  static async addFollower(userId, followerId) {
    const users = await readData(USERS_PATH);
    const user = users.find(u => u.id === userId);
    if (user) {
        user.followers.push(followerId);
        await writeData(USERS_PATH, users);
    }
}

static async removeFollower(userId, followerId) {
    const users = await readData(USERS_PATH);
    const user = users.find(u => u.id === userId);
    if (user) {
        user.followers = user.followers.filter(id => id !== followerId);
        await writeData(USERS_PATH, users);
    }
}
static async update(updatedUser) {
  const users = await readData(USERS_PATH);
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
      users[index] = updatedUser;
      await writeData(USERS_PATH, users);
  }
}

static async updateActivity(userId, activityType) {
  const users = await readData(USERS_PATH);
  const user = users.find(u => u.id === userId);
  if (user) {
      if (!user.activityHistory) user.activityHistory = [];

      const activity = {
          type: activityType,
          timestamp: new Date().toISOString()
      };

      user.activityHistory.push(activity);
      await writeData(USERS_PATH, users);
  }
}

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

module.exports = { User };

