/**
 * ============================================================================
 * Role-Based Access Control (RBAC) & Multi-Tenant Enforcement Middleware
 * ============================================================================
 * 
 * Guards API endpoints by validating user permission grants against their role
 * and preventing unauthorized cross-tenant data leakage between companies.
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { hasPermission, Permission } from '@thamilarasan/auth';

/**
 * Middleware factory that enforces specific permission requirements on routes.
 * 
 * @param permission The required atomic permission string (e.g., 'CANDIDATE:READ', 'REQUIREMENT:WRITE')
 */
export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: role ${req.user.role} lacks permission ${permission}`,
      });
    }

    next();
  };
}

/**
 * Multi-Tenant Isolation Middleware.
 * 
 * Guarantees that corporate users can only read and write records belonging
 * strictly to their own organization, while allowing platform superadmins
 * cross-tenant oversight.
 */
export function enforceTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // Platform administrative roles have cross-tenant governance privileges
  if (
    [
      'PLATFORM_ADMIN',
      'PLATFORM_OPERATIONS',
      'QA_REVIEWER',
      'FINANCE_APPROVER',
      'READ_ONLY_AUDITOR',
    ].includes(req.user.role)
  ) {
    return next();
  }

  // Company roles are strictly locked to their assigned organization ID
  const requestedCompanyId = req.params.companyId || req.body.companyId || req.query.companyId;
  if (requestedCompanyId && req.user.companyId && req.user.companyId !== requestedCompanyId) {
    return res.status(403).json({
      success: false,
      error: 'Tenant isolation violation: Access denied to foreign company resources',
    });
  }

  next();
}

