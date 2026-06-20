/\*\*

- ARCHITECTURE DECISIONS & RATIONALE
- ==================================
-
- This document explains the key architectural decisions made in the
- WRL platform redesign and the reasoning behind them.
- \*/

// ============================================================
// DECISION 1: UNIFIED LOGIN ENDPOINT
// ============================================================

/\*\*

- DECISION: Use single /api/auth/login for all roles
- instead of separate /api/login, /api/journalist/login, /api/prayer/login
-
- RATIONALE:
- - Eliminates code duplication (3 → 1 endpoint)
- - Single source of truth for auth logic
- - Easier to maintain and audit
- - Role is determined by user's database record, not endpoint
- - Cleaner API surface
- - Easier for frontend: always POST /api/auth/login
-
- TRADE-OFFS:
- - Slightly less role-specific error messages
- - But better consistency and security
-
- PRECEDENT: Industry standard (Auth0, Firebase, etc. all use single endpoint)
  \*/

// ============================================================
// DECISION 2: JWT + SESSION HYBRID
// ============================================================

/\*\*

- DECISION: Use JWTs for tokens + Database sessions for revocation
- instead of either Pure JWT or Pure Session-based auth
-
- RATIONALE:
- - JWTs: Stateless, scalable, fast verification (O(1))
- - Sessions: Enable instant revocation, logout, session management
- - Combined: Get best of both worlds
-
- PURE JWT PROBLEMS:
- - Can't revoke tokens until they expire
- - Can't invalidate all sessions immediately
- - Can't track user activity
-
- PURE SESSION PROBLEMS:
- - Requires database lookup on every request
- - Doesn't scale as well
- - Session store can be bottleneck
-
- OUR HYBRID SOLUTION:
- - Tokens verified offline (fast)
- - Sessions checked on protected routes (ensures revocation works)
- - Refresh tokens stored in DB (can be revoked)
- - Scales well even with database checks
    \*/

// ============================================================
// DECISION 3: REFRESH TOKEN MECHANISM
// ============================================================

/\*\*

- DECISION: Implement refresh tokens separate from access tokens
-
- RATIONALE:
- - Short-lived access tokens (8 hours): Limit damage if compromised
- - Long-lived refresh tokens (30 days): Good user experience
- - Refresh tokens in database: Can be revoked
- - Refresh tokens in secure storage: Not in URL/logs
-
- ALTERNATIVE (JWT only):
- - Simpler implementation
- - But long JWT validity = security risk
- - Short JWT validity = frequent re-login
-
- OUR APPROACH IS BETTER:
- - Balances security and user experience
- - Industry standard pattern
- - Supports logout/revocation
    \*/

// ============================================================
// DECISION 4: HTTPONLY COOKIES FOR ACCESS TOKEN
// ============================================================

/\*\*

- DECISION: Store access token in httpOnly cookie (not localStorage)
-
- RATIONALE:
- - httpOnly: JavaScript can't access (XSS protection)
- - Secure: Only sent over HTTPS (man-in-the-middle protection)
- - SameSite: Prevents CSRF attacks
- - Browser handles automatically (developer doesn't need to)
-
- ALTERNATIVES:
- - localStorage: Vulnerable to XSS attacks
- - sessionStorage: Same vulnerabilities as localStorage
- - In-memory state: Lost on page refresh
-
- OUR CHOICE:
- - Most secure by default
- - Transparent to frontend
- - Follows OWASP recommendations
-
- REFRESH TOKEN:
- - We store in localStorage (can't be httpOnly + sent to API)
- - Used only for /api/auth/refresh endpoint
- - Lesser impact if compromised (only gets new access token)
    \*/

// ============================================================
// DECISION 5: SINGLE COOKIE NAME FOR ALL ROLES
// ============================================================

/\*\*

- DECISION: Use single cookie name "wrl_auth_token" for all roles
- instead of separate cookies per role
-
- RATIONALE:
- - Simpler: One cookie to manage
- - Cleaner: Middleware doesn't need to handle multiple cookies
- - Role info stored in JWT payload (still secure, verified)
- - Easier for frontend: Same cookie for all roles
-
- ALTERNATIVE:
- - Separate cookies: wrl_admin_token, wrl_journalist_token, wrl_prayer_token
- - But this adds complexity without benefit
- - JWT payload is signed, can't be tampered with
-
- SECURITY:
- - Payload is verified before use
- - Role is checked against database
- - Tampered tokens rejected
    \*/

// ============================================================
// DECISION 6: DATABASE ROLES & STATUS ENUMS
// ============================================================

/\*\*

- DECISION: Use enums for UserRole and UserStatus in Prisma
-
- RATIONALE:
- - Type safety: Prevents invalid values
- - Database constraint: PostgreSQL enforces valid values
- - Automatic validation: No manual string checking
- - Clear intent: What values are possible?
-
- ROLES:
- - ADMIN: Full system access
- - JOURNALIST: Content creation
- - PRAYER: Prayer management
-
- STATUS:
- - ACTIVE: Can login and use system
- - INACTIVE: Disabled but might reactivate
- - DISABLED: Explicitly disabled by admin
- - PENDING_VERIFICATION: Awaiting email verification (future)
-
- BENEFITS:
- - Explicit state management
- - Can lock out users without deleting
- - Audit trail via status changes
    \*/

// ============================================================
// DECISION 7: AUDIT LOGGING
// ============================================================

/\*\*

- DECISION: Log all auth events to AuditLog table
-
- RATIONALE:
- - Security: Detect unauthorized access attempts
- - Compliance: Meet regulatory requirements
- - Investigation: Debug user issues
- - Threat detection: Identify patterns
-
- LOGGED EVENTS:
- - Login (success/failure)
- - Logout
- - Token refresh
- - Failed authentication attempts
- - Authorization denials
-
- INFORMATION:
- - User ID
- - Action taken
- - IP address (detect location changes)
- - User agent (detect device changes)
- - Timestamp
- - Success/failure status
- - Error message (for failures)
-
- IMPLEMENTATION:
- - Async logging (doesn't block requests)
- - Silent failures (logging errors don't break auth)
    \*/

// ============================================================
// DECISION 8: RATE LIMITING
// ============================================================

/\*\*

- DECISION: Implement rate limiting on auth endpoints
-
- RATIONALE:
- - Prevent brute force attacks
- - Prevent denial of service
- - Protect legitimate users
-
- IMPLEMENTATION:
- - Per IP address (not per user, to prevent lockout abuse)
- - Login: 20 attempts per minute
- - Refresh: No specific limit (should be rare)
- - Upload: 5 per user per minute (different strategy)
-
- TECHNOLOGY:
- - In-memory buckets for development
- - Should switch to Redis for production
-
- BENEFITS:
- - Simple to implement
- - Fast (in-memory)
- - Configurable
-
- LIMITATIONS:
- - Not distributed (only works in single-server setup)
- - Lost on server restart
- - For production: Use Redis
    \*/

// ============================================================
// DECISION 9: MIDDLEWARE APPROACH
// ============================================================

/\*\*

- DECISION: Middleware-based route protection
- instead of per-route auth checks
-
- RATIONALE:
- - Centralized: Single place for auth logic
- - Automatic: Applies to all routes in pattern
- - Fast: Rejects unauthorized early
- - Maintainable: Change logic once
-
- PROTECTION ROUTES:
- - /admin/\*: Requires ADMIN role
- - /journalist/\*: Requires ADMIN or JOURNALIST
- - /prayer/\*: Requires ADMIN or PRAYER
-
- MIDDLEWARE BENEFITS:
- - No duplication of auth checks
- - Clear route protection patterns
- - Easier to reason about security
- - Automatic redirects to login
-
- IMPLEMENTATION:
- - Config-based route patterns
- - Clean role checking
- - Session verification
    \*/

// ============================================================
// DECISION 10: API ERROR STANDARDIZATION
// ============================================================

/\*\*

- DECISION: Standardized error response format across all APIs
-
- RATIONALE:
- - Consistent frontend handling
- - Better error messages
- - Easier debugging
- - Professional appearance
-
- FORMAT:
- {
- "success": false,
- "error": "Human readable message",
- "code": "ERROR_CODE",
- "details": { ... }, // Optional, field-specific
- "timestamp": 1234567890
- }
-
- ERROR CODES:
- - AUTHENTICATION_ERROR: Not authenticated
- - AUTHORIZATION_ERROR: No permission
- - VALIDATION_ERROR: Invalid input
- - NOT_FOUND: Resource not found
- - CONFLICT: Resource conflict
- - RATE_LIMIT_EXCEEDED: Too many requests
- - INTERNAL_SERVER_ERROR: Server error
-
- BENEFITS:
- - Frontend can handle by code
- - Users see appropriate messages
- - Developers can debug easily
- - Consistent across endpoints
    \*/

// ============================================================
// DECISION 11: REACT CONTEXT FOR FRONTEND STATE
// ============================================================

/\*\*

- DECISION: Use React Context + Hooks for auth state
- instead of external state management (Redux, Zustand, etc.)
-
- RATIONALE:
- - No external dependencies
- - Built into React
- - Good enough for this use case
- - Easy to understand
-
- PROVIDES:
- - useAuth() hook: Access auth state and methods
- - useAuthRole() hook: Check role
- - useAuthUser() hook: Get current user
- - useIsAuthenticated() hook: Check auth status
- - useAuthLoading() hook: Check loading state
-
- BENEFITS:
- - Lightweight
- - Type-safe (with TypeScript)
- - Easy to test
- - Automatic token refresh
-
- ALTERNATIVES:
- - Redux: Overkill for this
- - Zustand: Nice, but adds dependency
- - Jotai: Nice, but adds dependency
-
- OUR CHOICE:
- - React Context sufficient
- - No external state library needed
- - Can upgrade later if needed
    \*/

// ============================================================
// DECISION 12: PRISMA ORM
// ============================================================

/\*\*

- DECISION: Use Prisma for all database access
- (not raw SQL or another ORM)
-
- RATIONALE:
- - Type-safe queries (prevents SQL injection)
- - Automatic migrations
- - Excellent TypeScript support
- - Clear schema definition
- - Community support
-
- PROVIDES:
- - Schema.prisma for all models
- - Automatic types from schema
- - Migrations from schema changes
- - Prisma Studio for browsing data
-
- BENEFITS:
- - Hard to write vulnerable queries
- - Schema-first development
- - Great developer experience
    \*/

// ============================================================
// DECISION 13: FILE UPLOADS WITH FILESYSTEM
// ============================================================

/\*\*

- DECISION: Use filesystem for uploads in development
- with abstraction layer for production (S3)
-
- RATIONALE:
- - Development: Simple, no external services
- - Production: Can switch to S3 without code changes
- - Security: Validate files before saving
- - Performance: Multiple storage backends
-
- CURRENT IMPLEMENTATION:
- - FileSystem adapter (public/uploads/)
- - File type validation
- - File size limits
- - UUID-based naming
- - Cleanup on error
-
- FUTURE IMPLEMENTATION:
- - S3 adapter (AWS S3)
- - GCS adapter (Google Cloud Storage)
- - Azure Blob adapter (Azure)
-
- ABSTRACTION:
- - IUploadService interface
- - uploadFile() method
- - deleteFile() method
- - getUrl() method
    \*/

// ============================================================
// SUMMARY
// ============================================================

/\*\*

- These architectural decisions prioritize:
-
- 1.  SECURITY
- - HTTP-only cookies
- - JWT verification
- - Session revocation
- - Rate limiting
- - Audit logging
-
- 2.  MAINTAINABILITY
- - Unified endpoints
- - Centralized logic
- - Type safety
- - Clear patterns
-
- 3.  SCALABILITY
- - Stateless tokens (can scale horizontally)
- - Efficient database queries
- - Rate limiting
- - Abstracted storage
-
- 4.  USER EXPERIENCE
- - Fast authentication
- - Automatic token refresh
- - Clear error messages
- - Support for multiple roles
-
- 5.  DEVELOPER EXPERIENCE
- - Simple APIs
- - Clear documentation
- - TypeScript support
- - Reusable patterns
-
- The result is a modern, production-ready authentication system
- that's secure, maintainable, scalable, and user-friendly.
  \*/
