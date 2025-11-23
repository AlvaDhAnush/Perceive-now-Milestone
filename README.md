# Perceive Now - Workflow Studio & Admin Console

A high-performance React application for workflow visualization and administrative management, built for Perceive Now's assessment.

## Features

### Story 1: Workflow Studio
- **Real-time DAG Visualization**: Interactive workflow graphs with React Flow
- **Live State Updates**: WebSocket simulation for real-time node state synchronization
- **Performance Optimized**: Memoization, virtualization, and efficient rendering for 100+ nodes
- **Contextual Debugging**: Click nodes to view detailed information, logs, and metrics
- **Smooth Animations**: State transitions with visual feedback

### Story 2: Admin Console
- **Role-Based Access Control (RBAC)**: Secure UI rendering based on user permissions
- **Real-time Metrics**: Auto-updating system metrics dashboard
- **Permission Gates**: Dynamic UI elements based on user roles (Admin, Analyst, Viewer)
- **Telemetry Integration**: OpenTelemetry JS instrumentation for observability
- **System Health Monitoring**: Live health status with color-coded indicators

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Flow** for DAG visualization
- **Zustand** for state management
- **React Query** for data fetching and caching
- **React Router** for navigation
- **OpenTelemetry JS** for telemetry

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## Usage

### Workflow Studio

1. Navigate to the Workflow Studio page
2. View the interactive DAG visualization
3. Click on any node to see detailed information
4. Watch real-time state updates as nodes transition through states (idle → running → completed)
5. Monitor performance metrics in the top-left panel

### Admin Console

1. Navigate to the Admin Console page
2. Login with one of the following emails:
   - `admin@perceive.ai` - Full access
   - `analyst@perceive.ai` - View and edit access
   - `viewer@perceive.ai` - View-only access
3. View real-time system metrics
4. Interact with management sections based on your role
5. Observe RBAC enforcement in action

## Project Structure

```
src/
  components/
    admin/          # Admin console components
    workflow/       # Workflow studio components
    Layout.tsx      # Main layout with navigation
  contexts/
    AuthContext.tsx # Authentication and RBAC context
  hooks/
    useMetrics.ts   # Metrics data fetching
    useTelemetry.ts # OpenTelemetry instrumentation
    useWebSocket.ts # WebSocket simulation
  pages/
    WorkflowStudio.tsx  # Story 1 implementation
    AdminConsole.tsx    # Story 2 implementation
  store/
    workflowStore.ts    # Zustand store for workflow state
  App.tsx              # Main app component
  main.tsx             # Entry point
```

## Design Briefs

Comprehensive design documents are available in the `docs/` directory:
- `STORY_1_DESIGN_BRIEF.md` - Workflow Studio architecture and implementation
- `STORY_2_DESIGN_BRIEF.md` - Admin Console RBAC and observability design

## Key Implementation Highlights

### Performance Optimizations
- Memoized React components to prevent unnecessary re-renders
- Virtualized rendering for large node graphs
- Efficient state management with Zustand
- React Query for intelligent caching and data fetching

### Security
- Role-based access control with permission gates
- Secure token handling (ready for production implementation)
- Content Security Policy considerations
- Sensitive data masking

### Real-time Features
- WebSocket simulation for live updates
- Auto-refreshing metrics dashboard
- State synchronization across components
- Connection status monitoring

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management

## Development Notes

- The WebSocket connection is simulated using intervals for demonstration
- Authentication is mocked for the assessment (email-based role assignment)
- Metrics are generated randomly for demonstration purposes
- OpenTelemetry events are logged to console (ready for production integration)

## License

This project is created for assessment purposes.

