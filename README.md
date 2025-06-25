# Pan-India Employee & Employer Rating Portal - Frontend

A comprehensive React-based frontend application for the Pan-India Employee & Employer Rating Portal. This platform allows employees to rate companies and employers to rate employees, creating a transparent rating ecosystem across India.

## 🚀 Features

### Authentication & User Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **Role-based Access** - Separate interfaces for employees and employers
- **Profile Management** - Update personal information, skills, and LinkedIn profiles
- **Avatar Support** - Profile pictures with automatic fallback initials

### Rating System
- **Comprehensive Rating Categories**
  - For Companies: Work Environment, Management Quality, Career Growth, Work-Life Balance, Compensation, Company Culture
  - For Employees: Technical Skills, Communication, Reliability, Team Collaboration, Problem Solving, Professionalism
- **Anonymous Rating Option** - Users can choose to rate anonymously
- **Rating History** - View all given and received ratings
- **Category-wise Breakdown** - Detailed ratings for each category

### Search & Discovery
- **Advanced Search** - Search by name, city, skills, or rating
- **Smart Filters** - Filter by location, minimum rating, and skills
- **Pagination** - Efficient browsing through large datasets
- **Real-time Results** - Instant search results as you type

### User Interface
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI Components** - Clean, professional interface with Tailwind CSS
- **Interactive Elements** - Hover effects, loading states, and smooth transitions
- **Accessibility** - WCAG compliant design patterns

## 🛠 Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router DOM 6.x
- **State Management**: React Query (TanStack Query) 5.x
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Common components (Header, Footer, etc.)
│   ├── forms/           # Form components
│   └── ui/              # Basic UI components (Button, Input, etc.)
├── pages/               # Page components
├── services/            # API service layer
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and constants
├── config/              # Configuration files
└── assets/              # Static assets
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pan_india_frontend_new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update API base URL in `src/config/api.js` if needed
   - Default backend URL: `http://localhost:8000`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5174`
   - The app will automatically reload on file changes

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### API Configuration
Update `src/config/api.js` to modify:
- Backend API URL
- Request timeout settings
- Pagination defaults
- Rating categories

### Styling
- Tailwind configuration: `tailwind.config.js`
- Custom styles: `src/index.css`
- Component-specific styles: Individual component files

## 📱 Key Components

### Authentication Flow
- **PublicRoute**: Redirects authenticated users away from login/register
- **ProtectedRoute**: Ensures only authenticated users access protected pages
- **AuthContext**: Manages authentication state globally

### Rating System
- **RatingForm**: Interactive form for submitting ratings
- **StarRating**: Reusable star rating component
- **RatingCard**: Display component for rating history

### Search & Filtering
- **SearchBar**: Real-time search with debouncing
- **FilterPanel**: Advanced filtering options
- **Pagination**: Navigate through large result sets

## 🎨 UI Components

### Basic Components
- **Button**: Multiple variants (primary, secondary, outline, danger)
- **Input**: Form inputs with validation states
- **Card**: Container component with header/body/footer
- **Badge**: Status and category indicators
- **Avatar**: User profile pictures with fallbacks
- **Modal**: Overlay dialogs and forms

### Layout Components
- **Header**: Navigation with user menu
- **LoadingSpinner**: Loading states
- **ErrorMessage**: Error handling display

## 🔐 Security Features

- **JWT Token Management**: Automatic token refresh
- **Protected Routes**: Role-based access control
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure API requests

## 📊 State Management

### React Query Integration
- **Caching**: Intelligent data caching and invalidation
- **Background Updates**: Automatic data synchronization
- **Error Handling**: Centralized error management
- **Loading States**: Built-in loading indicators

### Context Providers
- **AuthContext**: User authentication and profile data
- **ThemeContext**: UI theme management (future enhancement)

## 🌐 API Integration

### Service Layer
- **authService**: Authentication operations
- **userService**: User data management
- **ratingService**: Rating operations
- **apiClient**: HTTP client with interceptors

### Error Handling
- **Network Errors**: Automatic retry and user feedback
- **Validation Errors**: Field-level error display
- **Authentication Errors**: Automatic token refresh
- **Server Errors**: Graceful error messages

## 🎯 User Roles & Permissions

### Employee Features
- Browse and search companies
- Rate companies based on work experience
- View received ratings from employers
- Manage personal profile and skills

### Employer Features
- Browse and search employees
- Rate employees based on performance
- View received ratings from employees
- Manage company profile and services

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_VERSION`: Application version

### Hosting Options
- **Vercel**: Recommended for React applications
- **Netlify**: Easy deployment with form handling
- **AWS S3 + CloudFront**: Scalable static hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation for backend integration

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - User authentication and registration
  - Rating system for companies and employees
  - Search and filtering capabilities
  - Responsive design implementation
