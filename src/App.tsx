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
import ContactedProfilesPage from "@/pages/my/signals/page";
import {
  ENABLE_KAKAO_PAYMENTS,
  ENABLE_PROFILE_VIEW,
  ENABLE_REGISTER,
  GOOGLE_OAUTH_CLIENT_ID,
  PRIVACY,
  TERMS,
} from "@/env";
import KakaoPayPurchasePage from "@/pages/purchase/page__kakao";
import PurchaseSuccessPage from "@/pages/purchase/success/page";
import PurchaseFailPage from "@/pages/purchase/[fail,cancel]/page";
import MyPage from "@/pages/my/page";
import MyProfilePage from "@/pages/my/profile/page";
import TermPrivacyPage from "@/pages/[privacy,terms]/page";
import AnalysisMyProfilePage from "@/pages/my/analysis/page";
import GoogleAuthPage from "@/pages/auth/google/page";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
        path: "terms",
        element: <TermPrivacyPage title="이용약관" text={TERMS} />,
      },
      {
        path: "privacy",
        element: <TermPrivacyPage title="개인정보처리방침" text={PRIVACY} />,
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
        path: "my",
        element: ENABLE_REGISTER ? <MyPage /> : <Navigate to="/" />,
      },
      {
        path: "my/signals",
        element: ENABLE_PROFILE_VIEW ? (
          <ContactedProfilesPage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "my/profile",
        element: ENABLE_REGISTER ? <MyProfilePage /> : <Navigate to="/" />,
      },
      {
        path: "my/analysis",
        element: ENABLE_PROFILE_VIEW ? (
          <AnalysisMyProfilePage />
        ) : (
          <Navigate to="/" />
        ),
      },
      {
        path: "auth/google",
        element: GOOGLE_OAUTH_CLIENT_ID ? (
          <GoogleAuthPage />
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
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
