import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getDb } from '../utils/db';
import { generateToken } from '../middleware/auth';
import { UserSchema } from '../models';

const auth = new Hono();

// Login
auth.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();
        const db = getDb();

        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        if (user.password) {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return c.json({ error: 'Invalid credentials' }, 401);
            }
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return c.json({
            token,
            user: { ...userWithoutPassword, id: user._id.toString() }
        });
    } catch (error) {
        console.error('Login error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Register
auth.post('/register', async (c) => {
    try {
        const body = await c.req.json();
        const db = getDb();

        // Check if user exists
        const existingUser = await db.collection('users').findOne({ email: body.email });
        if (existingUser) {
            return c.json({ error: 'Email already registered' }, 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = {
            ...body,
            password: hashedPassword,
            role: body.role || 'Employee',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('users').insertOne(newUser);

        const token = generateToken({
            userId: result.insertedId.toString(),
            email: newUser.email,
            role: newUser.role,
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return c.json({
            token,
            user: { ...userWithoutPassword, id: result.insertedId.toString() }
        }, 201);
    } catch (error) {
        console.error('Register error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Get current user
auth.get('/me', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        const token = authHeader.split(' ')[1];
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'shiftmaster-secret-key-change-in-production') as any;

        const db = getDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        const { password: _, ...userWithoutPassword } = user;
        return c.json({ ...userWithoutPassword, id: user._id.toString() });
    } catch (error) {
        return c.json({ error: 'Invalid token' }, 401);
    }
});

export default auth;
