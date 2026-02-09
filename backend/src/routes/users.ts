import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getDb } from '../utils/db';

const users = new Hono();

// Get all users
users.get('/', async (c) => {
    try {
        const db = getDb();
        const teamId = c.req.query('teamId');
        const role = c.req.query('role');

        const filter: any = {};
        if (teamId) filter.teamId = teamId;
        if (role) filter.role = role;

        const usersList = await db.collection('users')
            .find(filter)
            .project({ password: 0 })
            .toArray();

        return c.json(usersList.map(u => ({ ...u, id: u._id.toString() })));
    } catch (error) {
        console.error('Get users error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Get user by ID
users.get('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ ...user, id: user._id.toString() });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Update user
users.put('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');
        const updates = await c.req.json();

        // Remove fields that shouldn't be updated
        delete updates._id;
        delete updates.password;
        updates.updatedAt = new Date();

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ message: 'User updated successfully' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Delete user
users.delete('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ message: 'User deleted successfully' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default users;
