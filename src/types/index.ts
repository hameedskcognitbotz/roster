export type Role = 'Admin' | 'Manager' | 'Employee';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
    teamId?: string;
}

export interface Team {
    id: string;
    name: string;
    color: string;
}

export interface Shift {
    id: string;
    userId: string;
    startTime: string; // ISO string
    endTime: string;   // ISO string
    roleId?: string;   // Optional strictly if needed, usually tied to User
    notes?: string;
    color?: string;    // Override team color
}

export interface Availability {
    userId: string;
    date: string; // YYYY-MM-DD
    status: 'Available' | 'Unavailable' | 'Preferred';
    timeRanges?: { start: string; end: string }[];
}

export interface TimeOffRequest {
    id: string;
    userId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    type: 'Vacation' | 'Sick' | 'Personal' | 'Other';
    status: 'Pending' | 'Approved' | 'Rejected';
    reason?: string;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
    timestamp: string;
    isRead: boolean;
}
