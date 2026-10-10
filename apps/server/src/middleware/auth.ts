/**
 * ============================================================================
 * Authentication Middleware
 * ============================================================================
 * 
 * Verifies JSON Web Tokens (JWT) presented in the HTTP Authorization header
 * and attaches decoded user identity and role claims to the request object.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '@thamilarasan/auth';

/**
 * Extended Express Request interface carrying verified authenticated user context.
 */
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Mandatory Authentication Middleware.
 * Rejects unauthenticated requests with HTTP 401 Unauthorized.
 */
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }

  // Attach decoded token claims (userId, role, companyId, email) to the request lifecycle
  req.user = payload;
  next();
}

/**
 * Optional Authentication Middleware.
 * Decodes Bearer tokens if present, but permits anonymous guests to proceed.
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

