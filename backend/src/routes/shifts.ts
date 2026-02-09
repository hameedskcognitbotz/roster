import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getDb } from '../utils/db';

const shifts = new Hono();

// Get all shifts with optional filters
shifts.get('/', async (c) => {
    try {
        const db = getDb();
        const userId = c.req.query('userId');
        const startDate = c.req.query('startDate');
        const endDate = c.req.query('endDate');
        const status = c.req.query('status');

        const filter: any = {};
        if (userId) filter.userId = userId;
        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.startTime = {};
            if (startDate) filter.startTime.$gte = startDate;
            if (endDate) filter.startTime.$lte = endDate;
        }

        const shiftsList = await db.collection('shifts')
            .find(filter)
            .sort({ startTime: 1 })
            .toArray();

        // Populate user info
        const userIds = [...new Set(shiftsList.map(s => s.userId))];
        const users = await db.collection('users')
            .find({ _id: { $in: userIds.map(id => new ObjectId(id)) } })
            .project({ password: 0 })
            .toArray();

        const userMap = new Map(users.map(u => [u._id.toString(), u]));

        const shiftsWithUsers = shiftsList.map(shift => ({
            ...shift,
            id: shift._id.toString(),
            user: userMap.get(shift.userId),
        }));

        return c.json(shiftsWithUsers);
    } catch (error) {
        console.error('Get shifts error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Get shift by ID
shifts.get('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        const shift = await db.collection('shifts').findOne({ _id: new ObjectId(id) });

        if (!shift) {
            return c.json({ error: 'Shift not found' }, 404);
        }

        return c.json({ ...shift, id: shift._id.toString() });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Create shift
shifts.post('/', async (c) => {
    try {
        const db = getDb();
        const body = await c.req.json();

        const newShift = {
            ...body,
            status: body.status || 'scheduled',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('shifts').insertOne(newShift);

        // Create notification for assigned user
        await db.collection('notifications').insertOne({
            userId: body.userId,
            title: 'New Shift Assigned',
            message: `You have been assigned a new shift on ${new Date(body.startTime).toLocaleDateString()}`,
            type: 'shift',
            read: false,
            createdAt: new Date(),
        });

        return c.json({
            ...newShift,
            id: result.insertedId.toString()
        }, 201);
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Update shift
shifts.put('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');
        const updates = await c.req.json();

        delete updates._id;
        updates.updatedAt = new Date();

        const result = await db.collection('shifts').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return c.json({ error: 'Shift not found' }, 404);
        }

        return c.json({ message: 'Shift updated successfully' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Delete shift
shifts.delete('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        const result = await db.collection('shifts').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return c.json({ error: 'Shift not found' }, 404);
        }

        return c.json({ message: 'Shift deleted successfully' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default shifts;
