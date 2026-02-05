import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getDb } from '../utils/db';

const teams = new Hono();

// Get all teams
teams.get('/', async (c) => {
    try {
        const db = getDb();
        const teamsList = await db.collection('teams').find().toArray();

        // Get member count for each team
        const teamsWithCount = await Promise.all(
            teamsList.map(async (team) => {
                const memberCount = await db.collection('users').countDocuments({ teamId: team._id.toString() });
                return { ...team, id: team._id.toString(), memberCount };
            })
        );

        return c.json(teamsWithCount);
    } catch (error) {
        console.error('Get teams error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Get team by ID
teams.get('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        const team = await db.collection('teams').findOne({ _id: new ObjectId(id) });

        if (!team) {
            return c.json({ error: 'Team not found' }, 404);
        }

        const members = await db.collection('users')
            .find({ teamId: id })
            .project({ password: 0 })
            .toArray();

        return c.json({
            ...team,
            id: team._id.toString(),
            members: members.map(m => ({ ...m, id: m._id.toString() }))
        });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Create team
teams.post('/', async (c) => {
    try {
        const db = getDb();
        const body = await c.req.json();

        const newTeam = {
            ...body,
            createdAt: new Date(),
        };

        const result = await db.collection('teams').insertOne(newTeam);

        return c.json({
            ...newTeam,
            id: result.insertedId.toString()
        }, 201);
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Update team
teams.put('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');
        const updates = await c.req.json();

        delete updates._id;

        const result = await db.collection('teams').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return c.json({ error: 'Team not found' }, 404);
        }

        return c.json({ message: 'Team updated successfully' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Delete team
teams.delete('/:id', async (c) => {
    try {
        const db = getDb();
        const id = c.req.param('id');

        const result = await db.collection('teams').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return c.json({ error: 'Team not found' }, 404);
        }

        return c.json({ message: 'Team deleted successfully' });
    } catch (error) {
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default teams;
