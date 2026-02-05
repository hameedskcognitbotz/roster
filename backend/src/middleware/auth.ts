import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'shiftmaster-secret-key-change-in-production';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        c.set('user', decoded);
        await next();
    } catch (error) {
        return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function requireRole(...roles: string[]) {
    return async (c: Context, next: Next) => {
        const user = c.get('user') as JWTPayload;

        if (!user || !roles.includes(user.role)) {
            return c.json({ error: 'Forbidden - Insufficient permissions' }, 403);
        }

        await next();
    };
}
