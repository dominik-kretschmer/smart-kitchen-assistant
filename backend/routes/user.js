// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
const router = express.Router();
const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../prisma/crud/user');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const user = await updateUser(parseInt(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    await deleteUser(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
