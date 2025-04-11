import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/page";
import ProfileRegisterPage from "@/pages/profile/register/page";
import ProfileVerificationPage from "@/pages/verify/page";
import ProfileListPage from "@/pages/profile/page";
import ContactViewPage from "@/pages/profile/contact/page";
import NotFound from "@/pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        path: "verify",
        element: <ProfileVerificationPage />,
      },
      {
        path: "profile",
        element: <ProfileListPage />,
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
        path: "profile/contact/:id",
        element: <ContactViewPage />,
      },
    ],
  },
]);

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
