import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import About from "./app/components/pages/About";
import Home from "./app/components/Home";
import Video from "./app/components/pages/Video";
import Faq from "./app/components/pages/Faq";
import AllProjects from "./app/components/pages/AllProjects";
import AllProperties from "./app/components/pages/AllProperties";
import ProjectDetails from "./app/components/pages/ProjectDetails";
import PropertyDetails from "./app/components/pages/PropertyDetails";
import AppLayout from "./app/components/AppLayout";
import Blogs from "./app/components/pages/Blogs";
import MangoInsights from "./app/components/pages/MangoInsights";
import Career from "./app/components/pages/Career";
import Contact from "./app/components/pages/Contact";
import SiteMap from "./app/components/pages/SiteMap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-svg-core/styles.css";
import CompareProjects from "./app/components/pages/CompareProjects";
import NotFound from "./app/components/pages/NotFound";
import ThankYouPage from "./app/components/ThankYouPage";
import FeaturedProperties from "./app/components/pages/FeaturedProperties";
import Privacy from "./app/components/pages/Privacy";
import TermAndCondition from "./app/components/pages/TermAndCondition";
import Login from "./app/components/pages/Login/Login";
import LoginDashboard from "./app/components/pages/Login/LoginDashboard";
import ProtectedRoute from "./app/components/ProtectedRoute";
import AdminDashboard from "./app/components/pages/AdminDashboard/AdminDashboard";
import AddProject from "./app/components/pages/ProjectDetailsParts/AddProject/AddProject";
import Dashboard from "./app/components/pages/Dashboard";
import LeadsDashboard from "./app/components/pages/Dashboard/LeadsDashboard";
import CustomSearchPage from "./app/components/pages/CustomSearchPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/video", element: <Video /> },
      { path: "/faq", element: <Faq /> },
      { path: "/allProjects", element: <AllProjects /> },
      { path: "/allProperties", element: <AllProperties /> },
      { path: "/mango-insights", element: <MangoInsights /> },
      { path: "/blogs", element: <Blogs /> },
      { path: "/blogs/:blogUrl", element: <Blogs /> },
      { path: "/compare", element: <CompareProjects /> },
      { path: "/career", element: <Career /> },
      { path: "/contact", element: <Contact /> },
      { path: "/sitemap", element: <SiteMap /> },
      { path: "/:urlName", element: <ProjectDetails /> },
      { path: "/propertyforsale", element: <PropertyDetails /> },
      { path: "/propertyforsale/:id", element: <PropertyDetails /> },
      {path:"/s/:slug",element:<CustomSearchPage/>},
      { path: "/featuredProperties", element: <FeaturedProperties /> },
      { path: "/thankYou", element: <ThankYouPage /> },
      { path: "*", element: <NotFound /> }, // Not Found route
      { path: "/404", element: <NotFound /> },
      { path: "/privacy-policy", element: <Privacy /> },
      { path: "/terms-and-conditions", element: <TermAndCondition /> },
      { path: "/projectDetails", element: <ProjectDetails /> },
      { path: "/login", element: <Login isOpen={true} onClose={() => {}} /> }, // Login route
      { path: "/admin", element: <LoginDashboard /> }, 
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/leads/dashboard",
        element: (
          <ProtectedRoute allowedRoles={['dm', 'superadmin']}>
            <Dashboard>
              <LeadsDashboard />
            </Dashboard>
          </ProtectedRoute>
        ),
      },
      {
        path: "addproject",
        element: (
          <ProtectedRoute>
            <AddProject />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
