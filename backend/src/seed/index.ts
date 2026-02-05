import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../utils/db';

const MOCK_TEAMS = [
    { name: 'Front of House', color: '#3b82f6', description: 'Customer-facing staff' },
    { name: 'Kitchen', color: '#ef4444', description: 'Kitchen and food preparation staff' },
    { name: 'Delivery', color: '#10b981', description: 'Delivery and logistics team' },
    { name: 'Management', color: '#8b5cf6', description: 'Management and supervisors' },
];

async function seed() {
    console.log('🌱 Starting database seed...');

    const db = await connectToDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('teams').deleteMany({});
    await db.collection('shifts').deleteMany({});
    await db.collection('timeoff_requests').deleteMany({});
    await db.collection('notifications').deleteMany({});

    // Insert teams
    console.log('👥 Creating teams...');
    const teamsResult = await db.collection('teams').insertMany(
        MOCK_TEAMS.map(team => ({ ...team, createdAt: new Date() }))
    );
    const teamIds = Object.values(teamsResult.insertedIds).map(id => id.toString());

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert users
    console.log('👤 Creating users...');
    const MOCK_USERS = [
        {
            name: 'Sarah Connor',
            email: 'sarah@shiftmaster.com',
            password: hashedPassword,
            role: 'Manager',
            teamId: teamIds[0],
            phone: '+1 (555) 123-4567',
            avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=3b82f6&color=fff'
        },
        {
            name: 'John Doe',
            email: 'john@shiftmaster.com',
            password: hashedPassword,
            role: 'Employee',
            teamId: teamIds[0],
            phone: '+1 (555) 234-5678',
            avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff'
        },
        {
            name: 'Jane Smith',
            email: 'jane@shiftmaster.com',
            password: hashedPassword,
            role: 'Employee',
            teamId: teamIds[1],
            phone: '+1 (555) 345-6789',
            avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ef4444&color=fff'
        },
        {
            name: 'Mike Johnson',
            email: 'mike@shiftmaster.com',
            password: hashedPassword,
            role: 'Employee',
            teamId: teamIds[2],
            phone: '+1 (555) 456-7890',
            avatarUrl: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff'
        },
        {
            name: 'Emily Davis',
            email: 'emily@shiftmaster.com',
            password: hashedPassword,
            role: 'Employee',
            teamId: teamIds[0],
            phone: '+1 (555) 567-8901',
            avatarUrl: 'https://ui-avatars.com/api/?name=Emily+Davis&background=8b5cf6&color=fff'
        },
        {
            name: 'David Wilson',
            email: 'david@shiftmaster.com',
            password: hashedPassword,
            role: 'Employee',
            teamId: teamIds[1],
            phone: '+1 (555) 678-9012',
            avatarUrl: 'https://ui-avatars.com/api/?name=David+Wilson&background=ec4899&color=fff'
        },
        {
            name: 'Admin User',
            email: 'admin@shiftmaster.com',
            password: hashedPassword,
            role: 'Admin',
            teamId: teamIds[3],
            phone: '+1 (555) 000-0000',
            avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff'
        },
    ];

    const usersResult = await db.collection('users').insertMany(
        MOCK_USERS.map(user => ({ ...user, createdAt: new Date(), updatedAt: new Date() }))
    );
    const userIds = Object.values(usersResult.insertedIds).map(id => id.toString());

    // Create shifts for next 2 weeks
    console.log('📅 Creating shifts...');
    const shifts = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const shiftDate = new Date(startOfWeek);
            shiftDate.setDate(startOfWeek.getDate() + (weekOffset * 7) + dayOffset);

            // Skip weekends for some users
            if (dayOffset >= 5 && Math.random() > 0.3) continue;

            // Create morning shift
            if (Math.random() > 0.3) {
                const morningStart = new Date(shiftDate);
                morningStart.setHours(9, 0, 0, 0);
                const morningEnd = new Date(shiftDate);
                morningEnd.setHours(17, 0, 0, 0);

                shifts.push({
                    userId: userIds[Math.floor(Math.random() * (userIds.length - 1)) + 1], // Skip admin
                    startTime: morningStart.toISOString(),
                    endTime: morningEnd.toISOString(),
                    status: 'scheduled',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            // Create evening shift
            if (Math.random() > 0.5) {
                const eveningStart = new Date(shiftDate);
                eveningStart.setHours(14, 0, 0, 0);
                const eveningEnd = new Date(shiftDate);
                eveningEnd.setHours(22, 0, 0, 0);

                shifts.push({
                    userId: userIds[Math.floor(Math.random() * (userIds.length - 1)) + 1],
                    startTime: eveningStart.toISOString(),
                    endTime: eveningEnd.toISOString(),
                    status: 'scheduled',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }
    }

    await db.collection('shifts').insertMany(shifts);

    // Create time-off requests
    console.log('🏖️  Creating time-off requests...');
    const timeOffRequests = [
        {
            userId: userIds[1],
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString().split('T')[0],
            endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9).toISOString().split('T')[0],
            reason: 'Family vacation',
            type: 'vacation',
            status: 'pending',
            createdAt: new Date(),
        },
        {
            userId: userIds[2],
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
            endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
            reason: 'Doctor appointment',
            type: 'personal',
            status: 'approved',
            reviewedBy: userIds[0],
            reviewedAt: new Date(),
            createdAt: new Date(),
        },
    ];

    await db.collection('timeoff_requests').insertMany(timeOffRequests);

    // Create notifications
    console.log('🔔 Creating notifications...');
    const notifications = [
        {
            userId: userIds[0],
            title: 'New Time-Off Request',
            message: 'John Doe has requested time off for Feb 10-12',
            type: 'timeoff',
            read: false,
            createdAt: new Date(),
        },
        {
            userId: userIds[1],
            title: 'Shift Assigned',
            message: 'You have been assigned a morning shift tomorrow',
            type: 'shift',
            read: false,
            createdAt: new Date(),
        },
        {
            userId: userIds[2],
            title: 'Time-Off Approved',
            message: 'Your time-off request has been approved',
            type: 'timeoff',
            read: true,
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
        },
    ];

    await db.collection('notifications').insertMany(notifications);

    // Create indexes
    console.log('📇 Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('shifts').createIndex({ userId: 1, startTime: 1 });
    await db.collection('shifts').createIndex({ startTime: 1 });
    await db.collection('notifications').createIndex({ userId: 1, read: 1 });
    await db.collection('timeoff_requests').createIndex({ userId: 1, status: 1 });

    console.log('✅ Seed completed successfully!');
    console.log(`   - ${MOCK_TEAMS.length} teams created`);
    console.log(`   - ${MOCK_USERS.length} users created`);
    console.log(`   - ${shifts.length} shifts created`);
    console.log(`   - ${timeOffRequests.length} time-off requests created`);
    console.log(`   - ${notifications.length} notifications created`);
    console.log('\n📝 Login credentials:');
    console.log('   Manager: sarah@shiftmaster.com / password123');
    console.log('   Admin: admin@shiftmaster.com / password123');
    console.log('   Employee: john@shiftmaster.com / password123');

    process.exit(0);
}

seed().catch(console.error);
