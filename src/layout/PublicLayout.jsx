import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import EventDetailsPage from "../pages/EventDetailsPage";
import ProfilePage from "../pages/ProfilePage";

import RequireAuth from "../auth/RequireAuth";

import VisibilitySelect from "../pages/Create/VisibilitySelect";
import FormatSelect from "../pages/Create/FormatSelect";
import PaymentSelect from "../pages/Create/PaymentSelect";
import EventCreateForm from "../pages/Create/EventCreateForm";
import ReviewEvent from "../pages/Create/ReviewEvent";
import AdminReviewPage from "../pages/Admin/AdminReviewPage";

/* DASHBOARD */
import DashboardLayout from "../dashboard/DashboardLayout";
import OverviewPage from "../dashboard/overview/OverviewPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN — rota pública */}
        <Route path="/login" element={<Login />} />

        {/* HOME — rota pública */}
        <Route path="/" element={<HomePage />} />

        {/* CRIAÇÃO */}
        <Route path="/create/visibility" element={<VisibilitySelect />} />
        <Route path="/create/format" element={<FormatSelect />} />
        <Route path="/create/payment" element={<PaymentSelect />} />
        <Route path="/create/form" element={<EventCreateForm />} />
        <Route path="/create/review" element={<ReviewEvent />} />

        {/* ADMIN */}
        <Route path="/admin/review" element={<AdminReviewPage />} />

        {/* PROTEGIDAS */}
        <Route
          path="/event/:id"
          element={
            <RequireAuth>
              <EventDetailsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        {/* DASHBOARD (PROTEGIDO) */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />

          {/* Páginas futuras */}
          <Route path="events" element={<div>Eventos</div>} />
          <Route path="tickets" element={<div>Ingressos</div>} />
          <Route path="guests" element={<div>Convidados</div>} />
        </Route>

        {/* CATCH-ALL — rotas inexistentes */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}
