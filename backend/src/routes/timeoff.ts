import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getDb } from '../utils/db';

const timeoff = new Hono();

// Get all time-off requests
timeoff.get('/', async (c) => {
    try {
        const db = getDb();
        const userId = c.req.query('userId');
        const status = c.req.query('status');

        const filter: any = {};
        if (userId) filter.userId = userId;
        if (status) filter.status = status;

        const requests = await db.collection('timeoff_requests')
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        // Populate user info
        const userIds = [...new Set(requests.map(r => r.userId))];
        const users = await db.collection('users')
            .find({ _id: { $in: userIds.map(id => new ObjectId(id)) } })
            .project({ password: 0, name: 1, email: 1, avatarUrl: 1 })
            .toArray();

        const userMap = new Map(users.map(u => [u._id.toString(), u]));

        const requestsWithUsers = requests.map(req => ({
            ...req,
            id: req._id.toString(),
            user: userMap.get(req.userId),
        }));

        return c.json(requestsWithUsers);
    } catch (error) {
        console.error('Get time-off requests error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Create time-off request
timeoff.post('/', async (c) => {
    try {
        const db = getDb();
        const body = await c.req.json();

        const newRequest = {
            ...body,
            status: 'pending',
            createdAt: new Date(),
        };

        const result = await db.collection('timeoff_requests').insertOne(newRequest);

        return c.json({
            ...newRequest,
            id: result.insertedId.toString()
        }, 201);
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Approve/Reject time-off request
timeoff.patch('/:id/status', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');
        const { status, reviewedBy } = await c.req.json();

        if (!['approved', 'rejected'].includes(status)) {
            return c.json({ error: 'Invalid status' }, 400);
        }

        const request = await db.collection('timeoff_requests').findOne({ _id: new ObjectId(id) });

        if (!request) {
            return c.json({ error: 'Request not found' }, 404);
        }

        await db.collection('timeoff_requests').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status,
                    reviewedBy,
                    reviewedAt: new Date()
                }
            }
        );

        // Create notification for the requester
        await db.collection('notifications').insertOne({
            userId: request.userId,
            title: `Time-Off Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your time-off request for ${request.startDate} to ${request.endDate} has been ${status}.`,
            type: 'timeoff',
            read: false,
            createdAt: new Date(),
        });

        return c.json({ message: `Request ${status} successfully` });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Delete time-off request
timeoff.delete('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        const result = await db.collection('timeoff_requests').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return c.json({ error: 'Request not found' }, 404);
        }

        return c.json({ message: 'Request deleted successfully' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default timeoff;
