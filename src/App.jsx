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
import DeveloperPage from "./app/components/pages/DeveloperPage";
import CompareProjects from "./app/components/pages/CompareProjects";
import NotFound from "./app/components/pages/NotFound";
import ThankYouPage from "./app/components/ThankYouPage";

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
      { path: "/developerPage", element: <DeveloperPage /> },
      { path: "/project/:urlName", element: <ProjectDetails /> },
      { path: "/propertyDetails", element: <PropertyDetails /> },
      { path: "/thankYou", element: <ThankYouPage /> },
      { path: "*", element: <NotFound /> }, // Not Found route
 
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
