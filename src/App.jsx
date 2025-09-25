import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OwnerPage from "./pages/OwnerPage";
import OwnerServices from "./pages/OwnerServices";
import OwnerBookings from "./pages/OwnerBookings";
import AccountBookings from "./pages/AccountBookings";
import AccountPage from "./pages/AccountPage";
import ServiceDetail from "./pages/ServiceDetail";
import AddServicePage from "./pages/AddServicePage";
import EditServicePage from "./pages/EditServicePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Home */}
              <Route index element={<HomePage />} />
              {/* Services */}
              <Route path="/services">
                <Route index element={<ServicesPage />} />
                <Route path=":serviceId" element={<ServiceDetail />} />
                <Route
                  path=":serviceId/add"
                  element={
                    <ProtectedRoute allowedRole="owner">
                      <AddServicePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":serviceId/edit"
                  element={
                    <ProtectedRoute allowedRole="owner">
                      <EditServicePage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              {/* Auth */}
              <Route path="/auth">
                <Route index element={<SignInPage />} />
                <Route path="signin" element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
              </Route>
              {/* Accounts */}
              <Route path="/account">
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <ProtectedRoute>
                      <AccountBookings />
                    </ProtectedRoute>
                  }
                />
              </Route>
              {/* Owner */}
              <Route path="/owner">
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRole="owner">
                      <OwnerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="services"
                  element={
                    <ProtectedRoute allowedRole="owner">
                      <OwnerServices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <ProtectedRoute allowedRole="owner">
                      <OwnerBookings />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
