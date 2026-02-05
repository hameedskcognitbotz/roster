import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getDb } from '../utils/db';

const notifications = new Hono();

// Get all notifications for user
notifications.get('/', async (c) => {
    try {
        const db = getDb();
        const userId = c.req.query('userId');
        const unreadOnly = c.req.query('unreadOnly') === 'true';

        const filter: any = {};
        if (userId) filter.userId = userId;
        if (unreadOnly) filter.read = false;

        const notificationsList = await db.collection('notifications')
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        return c.json(notificationsList.map(n => ({ ...n, id: n._id.toString() })));
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Mark notification as read
notifications.patch('/:id/read', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        await db.collection('notifications').updateOne(
            { _id: new ObjectId(id) },
            { $set: { read: true } }
        );

        return c.json({ message: 'Notification marked as read' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Mark all notifications as read for user
notifications.patch('/read-all', async (c) => {
    try {
        const db = getDb();
        const { userId } = await c.req.json();

        await db.collection('notifications').updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );

        return c.json({ message: 'All notifications marked as read' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Get unread count
notifications.get('/unread-count', async (c) => {
    try {
        const db = getDb();
        const userId = c.req.query('userId');

        if (!userId) {
            return c.json({ error: 'userId is required' }, 400);
        }

        const count = await db.collection('notifications').countDocuments({
            userId,
            read: false,
        });

        return c.json({ count });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default notifications;
