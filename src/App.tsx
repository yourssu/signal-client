import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProfileRegisterPage from "./pages/ProfileRegisterPage";
import ProfileVerificationPage from "./pages/ProfileVerificationPage";
import ProfileListPage from "./pages/ProfileListPage";
import ContactViewPage from "./pages/ContactViewPage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "profile/register",
        children: [
          {
            index: true,
            element: <ProfileRegisterPage />,
          },
          {
            path: "gender",
            element: <ProfileRegisterPage />,
          },
          {
            path: "animal",
            element: <ProfileRegisterPage />,
          },
          {
            path: "personal",
            element: <ProfileRegisterPage />,
          },
        ],
      },
      {
        path: "profile/verify",
        element: <ProfileVerificationPage />,
      },
      {
        path: "profile/list",
        element: <ProfileListPage />,
      },
      {
        path: "profile/contact/:id",
        element: <ContactViewPage />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
