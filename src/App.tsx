import React from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/page";
import ProfileRegisterPage from "@/pages/profile/register/page";
import BankAccountPaymentsPage from "@/pages/purchase/page";
import ProfileListPage from "@/pages/profile/page";
import ContactViewPage from "@/pages/profile/contact/page";
import NotFound from "@/pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SavedProfilesPage from "@/pages/profile/saved/page";
import {
  ENABLE_KAKAO_PAYMENTS,
  ENABLE_PROFILE_VIEW,
  ENABLE_REGISTER,
} from "@/env";
import KakaoPayPurchasePage from "@/pages/purchase/page__kakao";
import PurchaseSuccessPage from "@/pages/purchase/success/page";
import PurchaseFailPage from "@/pages/purchase/[fail,cancel]/page";

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
        path: "purchase",
        element: ENABLE_PROFILE_VIEW ? (
          ENABLE_KAKAO_PAYMENTS ? (
            <KakaoPayPurchasePage />
          ) : (
            <BankAccountPaymentsPage />
          )
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "purchase/success",
        element: ENABLE_PROFILE_VIEW ? (
          <PurchaseSuccessPage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "purchase/cancel",
        element: ENABLE_PROFILE_VIEW ? (
          <PurchaseFailPage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "purchase/fail",
        element: ENABLE_PROFILE_VIEW ? (
          <PurchaseFailPage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "profile",
        element: ENABLE_PROFILE_VIEW ? (
          <ProfileListPage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "profile/register",
        element: ENABLE_REGISTER ? (
          <ProfileRegisterPage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "profile/contact",
        element: ENABLE_PROFILE_VIEW ? (
          <ContactViewPage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "profile/saved",
        element: ENABLE_PROFILE_VIEW ? (
          <SavedProfilesPage />
        ) : (
          <Navigate to="/" />
        ),
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
