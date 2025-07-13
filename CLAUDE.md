# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start Development Server**: `npm start` (runs on port 8080)
- **Build for Production**: `npm run build`
- **Run Tests**: `npm test` (Jest with React Testing Library)
- **Eject Configuration**: `npm run eject` (one-way operation)

## Project Architecture

This is a React 18 real estate application called "Invest Mango" built with Create React App. The application is a property investment platform focusing on residential and commercial properties.

### Core Technology Stack
- **Frontend**: React 18 with React Router DOM v6 for routing
- **State Management**: Redux Toolkit for global state
- **Styling**: Bootstrap 5, Material-UI, Ant Design, and custom CSS
- **API Client**: Axios with interceptors for authentication
- **Authentication**: Token-based auth stored in localStorage
- **Error Tracking**: Sentry integration

### Application Structure

The app uses React Router with a nested route structure:
- `AppLayout` component wraps all routes with Header/Footer
- Main pages include Home, Projects, Properties, Blogs, Contact, Developer pages
- Admin dashboard with login system (`/loginadmin`)
- Dynamic routes for project details (`/:urlName`) and property details (`/propertyforsale/:id`)

### Key Directories

- `src/app/apis/api.js`: Centralized API layer with all backend calls
- `src/app/components/pages/`: Page components for each route
- `src/app/components/pages/Dashboard/`: Admin dashboard components
- `src/app/components/pages/ProjectDetailsParts/`: Project detail sub-components
- `src/app/components/pages/PropertyDetailParts/`: Property detail sub-components
- `src/app/components/styles/css/`: Component-specific CSS files
- `src/app/context/`: React context providers (currently commented out LoaderContext)

### API Configuration

The application connects to backend APIs via environment variables:
- `REACT_APP_BASE_URL`: Primary API endpoint
- `REACT_APP_SECONDARY_URL`: Secondary API for specific features (hiring, vacancies)

Authentication uses token-based system with Axios interceptors. All API calls are centralized in `src/app/apis/api.js`.

### Key Features

- **Property Listings**: Residential and commercial properties with filtering
- **Project Management**: Detailed project pages with galleries, floor plans, amenities
- **Lead Management**: Contact forms with OTP verification
- **Developer Profiles**: Information about property developers
- **Content Management**: Blogs, testimonials, careers section
- **Admin Dashboard**: Backend management interface with login system

### Testing

Uses Jest and React Testing Library. Basic test setup is in `src/setupTests.js` with @testing-library/jest-dom matchers.

### Deployment Notes

- The application includes Express server setup (`server.js`) and Dockerfile
- Uses react-snap for pre-rendering
- Sentry configuration for error tracking in production