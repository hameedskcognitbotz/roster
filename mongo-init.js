// MongoDB initialization script
// This runs when MongoDB container is first created

db = db.getSiblingDB('shiftmaster');

// Create collections with validation
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email', 'role'],
            properties: {
                name: { bsonType: 'string' },
                email: { bsonType: 'string' },
                password: { bsonType: 'string' },
                role: { enum: ['Admin', 'Manager', 'Employee'] },
                teamId: { bsonType: 'string' },
                avatarUrl: { bsonType: 'string' },
                phone: { bsonType: 'string' },
                createdAt: { bsonType: 'date' },
                updatedAt: { bsonType: 'date' }
            }
        }
    }
});

db.createCollection('teams');
db.createCollection('shifts');
db.createCollection('timeoff_requests');
db.createCollection('notifications');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.shifts.createIndex({ userId: 1, startTime: 1 });
db.shifts.createIndex({ startTime: 1 });
db.notifications.createIndex({ userId: 1, read: 1 });
db.timeoff_requests.createIndex({ userId: 1, status: 1 });

print('✅ ShiftMaster database initialized successfully!');
