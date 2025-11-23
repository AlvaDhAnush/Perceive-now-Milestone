# Story 2: "The Admin Console That Sees Everything" - Design Brief

## Executive Summary

This document describes the architecture and implementation approach for a secure, real-time Admin Console that enforces Role-Based Access Control (RBAC) and provides live observability metrics for Perceive Now's internal management system.

## RBAC Strategy

### Permission Model

**Role Hierarchy:**
- **Admin**: Full access (view, edit, delete, manage, configure)
- **Analyst**: Read and edit access (view, edit)
- **Viewer**: Read-only access (view)

**Permission Mapping:**
```typescript
const rolePermissions = {
  admin: ['view', 'edit', 'delete', 'manage', 'configure'],
  analyst: ['view', 'edit'],
  viewer: ['view'],
}
```

### Implementation Pattern

**Permission Gate Component:**
- **Wrapper Component**: `PermissionGate` wraps UI elements that require specific permissions
- **Context-Based Hooks**: `useAuth()` hook provides permission checking utilities
- **Declarative Rendering**: Permissions determine what UI elements are rendered

**Implementation Example:**
```typescript
<PermissionGate permission="edit">
  <button>Edit Workflow</button>
</PermissionGate>
```

**Benefits:**
- **Security**: UI elements are never rendered if user lacks permission
- **Maintainability**: Centralized permission logic
- **Type Safety**: TypeScript ensures permission strings are valid
- **Performance**: Unauthorized components never mount

### Dynamic UI Rendering

**Feature-Based Rendering:**
- Each section checks permissions before rendering
- Buttons and actions dynamically enabled/disabled
- Entire sections hidden for unauthorized users
- Fallback UI for restricted access

**Example Scenarios:**
- **Viewer**: Sees metrics and read-only views, no edit buttons
- **Analyst**: Sees edit buttons but no delete/manage options
- **Admin**: Full access to all features including access control management

## Data Fetching & Refresh Logic

### Real-Time Update Design

**React Query Integration:**
- **Polling Strategy**: Automatic refetch every 3 seconds for metrics
- **Stale Time**: 2 seconds to prevent unnecessary requests
- **Cache Management**: Intelligent caching reduces API calls
- **Background Updates**: Data refreshes without user interaction

**Configuration:**
```typescript
useQuery({
  queryKey: ['metrics'],
  queryFn: fetchMetrics,
  refetchInterval: 3000,
  staleTime: 2000,
})
```

### WebSocket Alternative

**Polling vs WebSocket:**
- **Current Implementation**: Polling for simplicity and reliability
- **Future Enhancement**: WebSocket for lower latency
- **Hybrid Approach**: WebSocket for critical updates, polling for metrics

### Error Recovery & Retry

**Error Handling Strategy:**
- **Automatic Retry**: Failed requests retry with exponential backoff
- **Error Boundaries**: Graceful error display without breaking UI
- **Offline Detection**: Handles network failures gracefully
- **User Feedback**: Clear error messages and loading states

**Retry Configuration:**
- Maximum 3 retry attempts
- Exponential backoff (1s, 2s, 4s)
- User notification on persistent failures

### Caching Strategy

**Cache Invalidation:**
- Time-based invalidation (staleTime)
- Manual invalidation on user actions
- Optimistic updates for better UX

**Cache Structure:**
- Metrics cached for 2 seconds
- User permissions cached for session
- Activity logs cached for 5 minutes

## Security & Performance

### API Token Handling

**Authentication Flow:**
1. User logs in with credentials
2. JWT token received and stored in localStorage (in production, use httpOnly cookies)
3. Token included in all API requests via Authorization header
4. Automatic token refresh before expiration

**Security Measures:**
- **Token Storage**: Secure storage mechanism
- **Token Validation**: Server-side validation on every request
- **CSRF Protection**: Token-based CSRF prevention
- **XSS Prevention**: Content Security Policy (CSP) headers

### Content Security Policy

**CSP Implementation:**
- Restrict inline scripts
- Whitelist trusted domains
- Prevent unauthorized resource loading
- Report violations for monitoring

### Sensitive Data Masking

**Data Protection:**
- Sensitive fields masked in UI (e.g., API keys, passwords)
- Role-based data filtering
- Audit logging for sensitive operations

### Render Efficiency

**Performance Optimizations:**
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive computations memoized
- **Virtual Scrolling**: For large data lists

**Incremental Hydration:**
- Critical UI rendered first
- Non-critical sections loaded progressively
- Skeleton loaders during data fetch

## Telemetry Integration

### Frontend Instrumentation

**OpenTelemetry JS Integration:**
- **Automatic Instrumentation**: HTTP requests, user interactions
- **Custom Spans**: Track specific operations
- **Error Tracking**: Capture and report errors
- **Performance Metrics**: Measure render times, API latency

**Implementation:**
```typescript
useTelemetry('admin_console_view', { userId: user?.id })
logUserAction('workflow_edit', { workflowId: '123' })
logPerformanceMetric('api_latency', 150, 'ms')
```

### Metrics Collected

**User Actions:**
- Page views
- Button clicks
- Form submissions
- Navigation patterns

**Performance Metrics:**
- API response times
- Component render times
- Time to interactive
- First contentful paint

**Error Metrics:**
- JavaScript errors
- API failures
- Network timeouts
- Permission denied events

### Observability Dashboard

**Console Logging:**
- Structured logging for development
- Production-ready telemetry export
- Integration with monitoring tools (e.g., Datadog, New Relic)

## Implementation Details

### Component Architecture

**Permission Gate Component:**
- Wraps protected UI elements
- Checks permissions via context
- Renders fallback or nothing if unauthorized

**Login Modal:**
- Simulated authentication
- Role assignment based on email pattern
- Session persistence

**System Health Banner:**
- Real-time health status
- Color-coded indicators (green/yellow/red)
- Key metrics at a glance

### State Management

**Context API:**
- Auth context for user and permissions
- Global state for user session
- Permission checking utilities

**React Query:**
- Server state management
- Automatic caching and refetching
- Optimistic updates

### UI/UX Features

**Real-Time Metrics:**
- Auto-updating dashboard
- Visual progress bars
- Color-coded status indicators
- Timestamp display

**RBAC UI:**
- Dynamic button states
- Hidden sections for unauthorized users
- Clear permission indicators
- Access denied messages

**Loading States:**
- Skeleton loaders
- Spinner animations
- Progress indicators
- Error states

## Testing Strategy

### Security Testing
- Permission boundary testing
- Unauthorized access attempts
- Token validation
- XSS/CSRF protection

### Performance Testing
- Load time benchmarks
- API response time monitoring
- Memory usage profiling
- Render performance

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ARIA label verification

## Future Enhancements

1. **Advanced RBAC**: Resource-level permissions, custom roles
2. **Audit Logging**: Comprehensive action logging
3. **Real-Time Collaboration**: Multi-user admin sessions
4. **Advanced Analytics**: Usage patterns, performance trends
5. **Mobile Responsiveness**: Full mobile admin experience

## Conclusion

This Admin Console implementation provides a secure, performant, and user-friendly interface for managing Perceive Now's systems. The RBAC implementation ensures users only see and interact with features they're authorized to use, while real-time updates keep the dashboard current and actionable. The telemetry integration provides valuable insights into system performance and user behavior.

