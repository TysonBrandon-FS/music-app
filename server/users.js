const bcrypt = require('bcryptjs');

const users = [];

async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
}

createUser('testuser', 'password123');
createUser('user123', 'Password123');

module.exports = users; 