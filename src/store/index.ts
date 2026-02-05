import { create } from 'zustand';
import { type User, type Shift, type Team, type Availability, type TimeOffRequest, type Notification } from '../types';
import { addDays, startOfWeek, subDays } from 'date-fns';

interface AppState {
    currentUser: User | null;
    users: User[];
    teams: Team[];
    shifts: Shift[];
    availability: Availability[];
    timeOffRequests: TimeOffRequest[];
    notifications: Notification[];

    // UI State
    isAddShiftModalOpen: boolean;
    shiftModalData?: { userId?: string; date?: string };

    // Auth Actions
    login: (email: string) => void;
    logout: () => void;
    updateUserInfo: (user: User) => void;

    // Shift Actions
    addShift: (shift: Shift) => void;
    updateShift: (shift: Shift) => void;
    deleteShift: (id: string) => void;
    setAddShiftModalOpen: (open: boolean, data?: { userId?: string; date?: string }) => void;

    // User Actions
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;

    // Team Actions
    addTeam: (team: Team) => void;
    updateTeam: (team: Team) => void;
    deleteTeam: (id: string) => void;

    // Availability Actions
    setAvailability: (availability: Availability) => void;

    // Time-Off Actions
    addTimeOffRequest: (request: TimeOffRequest) => void;
    updateTimeOffStatus: (id: string, status: TimeOffRequest['status']) => void;

    // Notification Actions
    markAsRead: (id: string) => void;
    clearNotifications: () => void;
}

// Seed Data
const MOCK_TEAMS: Team[] = [
    { id: 't1', name: 'Front of House', color: '#3b82f6' },
    { id: 't2', name: 'Kitchen', color: '#ef4444' },
    { id: 't3', name: 'Delivery', color: '#10b981' },
];

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Sarah Connor', email: 'sarah@example.com', role: 'Manager', teamId: 't1', avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=random' },
    { id: 'u2', name: 'John Doe', email: 'john@example.com', role: 'Employee', teamId: 't1', avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
    { id: 'u3', name: 'Jane Smith', email: 'jane@example.com', role: 'Employee', teamId: 't2', avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random' },
    { id: 'u4', name: 'Mike Johnson', email: 'mike@example.com', role: 'Employee', teamId: 't3', avatarUrl: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random' },
];

const today = new Date();
const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

const MOCK_SHIFTS: Shift[] = [
    {
        id: 's1',
        userId: 'u2',
        startTime: addDays(startOfCurrentWeek, 0).toISOString().split('T')[0] + 'T09:00:00',
        endTime: addDays(startOfCurrentWeek, 0).toISOString().split('T')[0] + 'T17:00:00'
    },
    {
        id: 's2',
        userId: 'u3',
        startTime: addDays(startOfCurrentWeek, 0).toISOString().split('T')[0] + 'T14:00:00',
        endTime: addDays(startOfCurrentWeek, 0).toISOString().split('T')[0] + 'T22:00:00'
    },
    {
        id: 's3',
        userId: 'u2',
        startTime: addDays(startOfCurrentWeek, 1).toISOString().split('T')[0] + 'T09:00:00',
        endTime: addDays(startOfCurrentWeek, 1).toISOString().split('T')[0] + 'T17:00:00'
    },
];

const MOCK_TIME_OFF: TimeOffRequest[] = [
    { id: 'tr1', userId: 'u2', startDate: addDays(today, 5).toISOString().split('T')[0], endDate: addDays(today, 7).toISOString().split('T')[0], type: 'Vacation', status: 'Pending', reason: 'Family trip' },
    { id: 'tr2', userId: 'u3', startDate: subDays(today, 2).toISOString().split('T')[0], endDate: subDays(today, 2).toISOString().split('T')[0], type: 'Sick', status: 'Approved', reason: 'Flu' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', userId: 'u1', message: 'New shift request from John Doe', type: 'info', timestamp: subDays(today, 1).toISOString(), isRead: false },
    { id: 'n2', userId: 'u1', message: 'Jane Smith approved her shift schedule', type: 'success', timestamp: subDays(today, 0.5).toISOString(), isRead: true },
];

export const useStore = create<AppState>((set) => ({
    currentUser: MOCK_USERS[0],
    users: MOCK_USERS,
    teams: MOCK_TEAMS,
    shifts: MOCK_SHIFTS,
    availability: [],
    timeOffRequests: MOCK_TIME_OFF,
    notifications: MOCK_NOTIFICATIONS,
    isAddShiftModalOpen: false,

    login: (email) => set((state) => ({
        currentUser: state.users.find(u => u.email === email) || null
    })),
    logout: () => set({ currentUser: null }),
    updateUserInfo: (updatedUser) => set((state) => ({
        currentUser: updatedUser,
        users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    })),

    addShift: (shift) => set((state) => ({
        shifts: [...state.shifts, shift]
    })),
    updateShift: (updatedShift) => set((state) => ({
        shifts: state.shifts.map(s => s.id === updatedShift.id ? updatedShift : s)
    })),
    deleteShift: (id) => set((state) => ({
        shifts: state.shifts.filter(s => s.id !== id)
    })),
    setAddShiftModalOpen: (open, data) => set({
        isAddShiftModalOpen: open,
        shiftModalData: data || {}
    }),

    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    updateUser: (user) => set((state) => ({
        users: state.users.map(u => u.id === user.id ? user : u)
    })),
    deleteUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
    })),

    addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
    updateTeam: (team) => set((state) => ({
        teams: state.teams.map(t => t.id === team.id ? team : t)
    })),
    deleteTeam: (id) => set((state) => ({
        teams: state.teams.filter(t => t.id !== id)
    })),

    setAvailability: (availability) => set((state) => ({
        availability: [...state.availability.filter(a => a.userId !== availability.userId || a.date !== availability.date), availability]
    })),

    addTimeOffRequest: (request) => set((state) => ({
        timeOffRequests: [...state.timeOffRequests, request]
    })),
    updateTimeOffStatus: (id, status) => set((state) => ({
        timeOffRequests: state.timeOffRequests.map(r => r.id === id ? { ...r, status } : r)
    })),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    })),
    clearNotifications: () => set({ notifications: [] }),
}));

