import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import EventDetailsPage from "../pages/EventDetailsPage";
import ProfilePage from "../pages/ProfilePage";

import RequireAuth from "../auth/RequireAuth";

/* CREATE EVENT */
import VisibilitySelect from "../pages/Create/VisibilitySelect";
import FormatSelect from "../pages/Create/FormatSelect";
import PaymentSelect from "../pages/Create/PaymentSelect";
import EventCreateForm from "../pages/Create/EventCreateForm";
import ReviewEvent from "../pages/Create/ReviewEvent"; // ✅ ADICIONADO

/* ADMIN */
import AdminReviewPage from "../pages/Admin/AdminReviewPage";

/* DASHBOARD + NAVBAR */
import DashboardLayout from "../dashboard/DashboardLayout";
import OverviewPage from "../dashboard/overview/OverviewPage";
import DashboardEventPage from "../dashboard/events/DashboardEventPage";
import EventOverviewPage from "../dashboard/events/EventOverviewPage";
import EventGuestsPage from "../dashboard/events/EventGuestsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* TODA ÁREA LOGADA COM NAVBAR */}
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<HomePage />} />

          {/* CREATE EVENT FLOW */}
          <Route path="/create/visibility" element={<VisibilitySelect />} />
          <Route path="/create/format" element={<FormatSelect />} />
          <Route path="/create/payment" element={<PaymentSelect />} />
          <Route path="/create/form" element={<EventCreateForm />} />
          <Route path="/create/review" element={<ReviewEvent />} /> {/* ✅ ADICIONADO */}

          <Route path="/profile" element={<ProfilePage />} />

          {/* EVENT DETAILS */}
          <Route path="/event/:id" element={<EventDetailsPage />} />

          {/* DASHBOARD */}
          <Route path="/dashboard">
            <Route index element={<OverviewPage />} />
            <Route path="event/:id" element={<DashboardEventPage />}>
              <Route index element={<EventOverviewPage />} />
              <Route path="guests" element={<EventGuestsPage />} />
            </Route>
          </Route>
        </Route>

        {/* ADMIN */}
        <Route path="/admin/review" element={<AdminReviewPage />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
