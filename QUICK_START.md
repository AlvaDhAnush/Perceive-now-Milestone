# Quick Start Guide

## Installation

```bash
# Install all dependencies
npm install

# Start the development server
npm run dev
```

The application will open at `http://localhost:3000`

## Testing the Features

### Story 1: Workflow Studio

1. Navigate to **Workflow Studio** from the top navigation
2. You'll see an interactive DAG with 5 nodes
3. **Click any node** to see detailed information in the side panel
4. Watch nodes automatically transition through states:
   - **Idle** (gray) → **Running** (blue, pulsing) → **Completed** (green)
   - Occasionally nodes may **Fail** (red) and reset
5. Check the top-left panel for connection status and performance metrics

### Story 2: Admin Console

1. Navigate to **Admin Console** from the top navigation
2. You'll be prompted to login
3. **Login with one of these emails** (password can be anything):
   - `admin@perceive.ai` - Full access (view, edit, delete, manage)
   - `analyst@perceive.ai` - View and edit access
   - `viewer@perceive.ai` - View-only access
4. After login, you'll see:
   - **System Health Banner** at the top (green/yellow/red)
   - **Real-time Metrics Dashboard** (auto-updates every 3 seconds)
   - **Management Sections** with role-based buttons:
     - Admin: Can see and use all buttons including "Manage Access"
     - Analyst: Can see edit buttons but not delete/manage options
     - Viewer: Only sees view buttons, edit options are disabled
5. **Try different roles** by logging out and logging in with different emails
6. Check the browser console to see OpenTelemetry logs and user action tracking

## Key Features Demonstrated

### Performance Optimizations
- Memoized components prevent unnecessary re-renders
- Virtualized canvas rendering (ready for 100+ nodes)
- Efficient state management with Zustand
- React Query for smart caching

### Real-time Updates
- WebSocket simulation for workflow state changes
- Auto-refreshing metrics dashboard
- Live connection status indicator

### Security & RBAC
- Permission-based UI rendering
- Dynamic button states
- Hidden sections for unauthorized users
- Secure authentication flow

### Observability
- OpenTelemetry instrumentation
- User action logging
- Performance metrics tracking
- Console logging (ready for production integration)

## Project Structure

```
src/
  components/
    admin/          # Admin console components
    workflow/       # Workflow visualization components
  contexts/         # React contexts (Auth)
  hooks/            # Custom React hooks
  pages/            # Main page components
  store/            # Zustand state stores
```

## Design Briefs

Comprehensive design documents are in the `docs/` folder:
- `STORY_1_DESIGN_BRIEF.md` - Workflow Studio architecture
- `STORY_2_DESIGN_BRIEF.md` - Admin Console RBAC design

## Notes

- WebSocket is simulated using intervals for demonstration
- Authentication is mocked (email-based role assignment)
- Metrics are randomly generated for demo purposes
- All telemetry logs to console (production-ready for integration)

