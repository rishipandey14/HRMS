# HRMS Task Management System - Frontend

A comprehensive Human Resource Management System (HRMS) with advanced task tracking, project management, team collaboration, and real-time chat features built with React, Vite, and TailwindCSS.

## 🚀 Features

### Core Functionality
- **Dashboard**: Real-time overview of tasks, projects, and team activities with interactive charts
- **Project Management**: Create, manage, and track multiple projects with team assignments
- **Task Tracking**: Comprehensive task management with status updates, assignments, and deadlines
- **Task Updates**: Detailed update history for each task with user attribution
- **Team Management**: View and manage team members, roles, and permissions
- **Calendar Integration**: FullCalendar-powered scheduling and task visualization
- **Real-time Chat**: Integrated messaging system with Socket.IO for team communication
- **Job Postings**: Create and manage job listings
- **Settings**: User profile management and application configuration

### User Experience
- **Role-Based Access Control**: Admin and regular user roles with appropriate permissions
- **Responsive Design**: Mobile-first approach with device-specific optimizations
- **Protected Routes**: Secure authentication and authorization
- **Task Filtering**: Filter tasks by assignment ("All Tasks" or "Assigned to Me")
- **Selective Interaction**: Users can only interact with tasks assigned to them
- **Real-time Updates**: Live notifications and updates via WebSocket connections

## 🛠️ Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 7.0.0
- **Styling**: TailwindCSS 4.1.11
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Axios 1.13.2
- **Calendar**: FullCalendar 6.1.18
- **Charts**: Recharts 3.0.2
- **Real-time**: Socket.IO Client 4.8.1
- **Animations**: Framer Motion 12.23.24
- **Icons**: Lucide React, React Icons
- **Linting**: ESLint 9.29.0

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running backend API server (task-tracker-backend)
- Running chat backend server (chat-app-backend)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishipandey14/HRMS.git
   cd HRMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   Then update the values:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_CHAT_API_BASE_URL=http://localhost:5001
   ```

   - `VITE_API_BASE_URL`: Task tracker backend API endpoint
   - `VITE_CHAT_API_BASE_URL`: Chat backend API endpoint

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
task/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # React components
│   │   ├── Basic/         # Reusable UI components (buttons, forms, etc.)
│   │   ├── Calender/      # Calendar components
│   │   ├── Company/       # Organization setup components
│   │   ├── Job/           # Job posting components
│   │   ├── Messege/       # Chat/messaging components
│   │   ├── Nember/        # Team member and task components
│   │   ├── Project/       # Project-specific components
│   │   └── Setting/       # Settings components
│   ├── layout/            # Layout components (Navbar, Sidebar, etc.)
│   ├── pages/             # Page components (routes)
│   ├── router/            # Route protection and configuration
│   ├── utility/           # Helper functions and configurations
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── .env.example           # Environment variables template
├── docker-compose.yml     # Docker composition
├── Dockerfile             # Docker configuration
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
└── vite.config.js         # Vite configuration
```

## 🔑 Key Components

### Authentication
- **Login**: JWT-based authentication
- **Protected Routes**: Route guards for authenticated users
- **Organization Setup**: Initial company configuration

### Project Management
- **ProjectPage**: Detailed project view with tasks and team members
- **CreateProject**: Create new projects with team assignments
- **Task Component**: Display and manage project tasks
- **TaskUpdates**: View and add task progress updates

### Team Collaboration
- **Team Page**: View all team members
- **Member Component**: Individual member profiles
- **Chat Integration**: Real-time team communication

### Dashboard & Analytics
- **Dashboard**: Overview with task statistics and charts
- **Calendar**: Visual task scheduling
- **Charts**: Data visualization with Recharts

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all API requests via Authorization header
5. Protected routes verify token validity

## 🎨 Styling

The application uses TailwindCSS with a custom configuration for consistent theming:
- Responsive breakpoints
- Custom color palette
- Utility-first approach
- Component-level styling

## 🌐 API Integration

The frontend communicates with two backend services:

### Task Tracker Backend (Port 5000)
- Authentication endpoints
- Project CRUD operations
- Task management
- Team management
- Dashboard analytics

### Chat Backend (Port 5001)
- Real-time messaging
- Socket.IO events
- Chat history

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Mobile block page for restricted devices
- Optimized navigation for smaller screens

## 🐳 Docker Support

Build and run using Docker:

```bash
docker-compose up
```

Or build manually:

```bash
docker build -t hrms-task-frontend .
docker run -p 5173:5173 hrms-task-frontend
```

## 🔒 Security Features

- JWT token authentication
- Role-based access control (Admin/User)
- Protected API routes
- Secure credential storage
- CORS configuration
- Input validation

## 🐛 Common Issues & Troubleshooting

1. **API Connection Errors**
   - Verify backend servers are running
   - Check .env configuration
   - Ensure correct ports (5000, 5001)

2. **Authentication Issues**
   - Clear localStorage
   - Check token expiration
   - Verify backend JWT secret

3. **Real-time Features Not Working**
   - Check Socket.IO connection
   - Verify chat backend is running
   - Check WebSocket support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of an HRMS system for internal use.

## 🔗 Related Projects

- **[task-tracker-backend](https://github.com/your-username/task-tracker-backend)**: Main API server for task and project management
- **[chat-app-backend](https://github.com/your-username/chat-app-backend)**: Real-time messaging backend

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React + Vite + TailwindCSS
