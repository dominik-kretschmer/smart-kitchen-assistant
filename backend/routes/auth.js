import express from 'express';
import { PrismaClient } from '@prisma/client';
import { getUser } from '../prisma/crud/user.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('userId', { path: '/' });
  res.clearCookie('sessionToken', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/me', async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await getUser(parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get current user' + error });
  }
});

export default router;
