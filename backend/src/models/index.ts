import { ObjectId } from 'mongodb';
import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6).optional(), // Optional for SSO users
    role: z.enum(['Admin', 'Manager', 'Employee']),
    teamId: z.string().optional(),
    avatarUrl: z.string().optional(),
    phone: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Team Schema
export const TeamSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    name: z.string().min(1),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    description: z.string().optional(),
    createdAt: z.date().optional(),
});

export type Team = z.infer<typeof TeamSchema>;

// Shift Schema
export const ShiftSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    userId: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    notes: z.string().optional(),
    status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
    createdBy: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Shift = z.infer<typeof ShiftSchema>;

// Availability Schema
export const AvailabilitySchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    userId: z.string(),
    date: z.string(), // YYYY-MM-DD
    status: z.enum(['Available', 'Unavailable', 'Preferred']),
    timeRanges: z.array(z.object({
        start: z.string(),
        end: z.string(),
    })).optional(),
    createdAt: z.date().optional(),
});

export type Availability = z.infer<typeof AvailabilitySchema>;

// TimeOff Request Schema
export const TimeOffRequestSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    userId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    reason: z.string().optional(),
    type: z.enum(['vacation', 'sick', 'personal', 'other']),
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    reviewedBy: z.string().optional(),
    reviewedAt: z.date().optional(),
    createdAt: z.date().optional(),
});

export type TimeOffRequest = z.infer<typeof TimeOffRequestSchema>;

// Shift Swap Request Schema
export const ShiftSwapSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    requesterId: z.string(),
    targetUserId: z.string(),
    requesterShiftId: z.string(),
    targetShiftId: z.string().optional(),
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    reviewedBy: z.string().optional(),
    reviewedAt: z.date().optional(),
    createdAt: z.date().optional(),
});

export type ShiftSwap = z.infer<typeof ShiftSwapSchema>;

// Notification Schema
export const NotificationSchema = z.object({
    _id: z.instanceof(ObjectId).optional(),
    userId: z.string(),
    title: z.string(),
    message: z.string(),
    type: z.enum(['shift', 'timeoff', 'swap', 'schedule', 'general']),
    read: z.boolean().default(false),
    createdAt: z.date().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;
