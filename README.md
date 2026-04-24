# NexusHR - Enterprise Employee Management Dashboard

NexusHR is a premium, high-performance Human Resource Management System (HRMS) designed for modern enterprises. It features a futuristic "Agentic" UI with glassmorphism aesthetics, real-time data synchronization via Firebase, and robust role-based access control.

## 🚀 Live Demo
https://employee-management-dashboard-uyoh-hv201zn15.vercel.app/login

## ✨ Key Features

### 🏢 Multi-Role Dashboards
- **System Administrators/Managers**: Comprehensive overview of company-wide metrics, attendance trends, departmental health, and personnel management.
- **Employees**: Personalized portal for time-tracking, leave requests, and activity history.

### ⏱️ Real-time Attendance Tracking
- **Smart Punch-In/Out**: Precision timekeeping with automatic duration calculation.
- **Activity Log**: Detailed history of work sessions with status indicators (Present, Late, etc.).

### 📅 Advanced Leave Management
- **Seamless Application**: Employees can apply for Sick, Casual, or Annual leaves with reason justifications.
- **Administrative Queue**: Real-time authorization panel for managers to approve or decline requests instantly.

### 👥 Personnel Directory
- **Employee Management**: Add, track, and manage employee profiles with real-time search and filtering.
- **Security Protocols**: Role-based visibility ensures sensitive data is only accessible to authorized personnel.

### 🔐 Secure Authentication
- **Multi-Factor Auth**: Secure login via Email/Password.
- **Google Integration**: One-click registration and login using Google Authentication.
- **Auto-Role Assignment**: Intelligent role detection during registration.

## 🛠️ Technology Stack

- **Frontend Framework**: [React.js](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI/UX Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Routing**: [Wouter](https://github.com/molecula/wouter)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: React Hook Form & Zod

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Umama-aqeel55/Employee_Management_Dashboard.git
   cd Employee_Management_Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is optimized for deployment on **Vercel**:

1. Import the repository to Vercel.
2. Set the **Output Directory** to `dist/public`.
3. Add your Environment Variables in the Vercel dashboard.
4. Deploy!

## 📄 License
This project is licensed under the MIT License.

---
Developed with ❤️ by [Umama Aqeel](https://github.com/Umama-aqeel55)
