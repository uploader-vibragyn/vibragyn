import { Routes, Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import RequireAuth from "../auth/RequireAuth";

import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import EventDetailsPage from "../pages/EventDetailsPage";
import ProfilePage from "../pages/ProfilePage";

import VisibilitySelect from "../pages/Create/VisibilitySelect";
import FormatSelect from "../pages/Create/FormatSelect";
import PaymentSelect from "../pages/Create/PaymentSelect";
import EventCreateForm from "../pages/Create/EventCreateForm";
import ReviewEvent from "../pages/Create/ReviewEvent";

import OverviewPage from "../dashboard/overview/OverviewPage";
import DashboardEventPage from "../dashboard/events/DashboardEventPage";
import EventOverviewPage from "../dashboard/events/EventOverviewPage";
import EventGuestsPage from "../dashboard/events/EventGuestsPage";

import AdminReviewPage from "../pages/Admin/AdminReviewPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/feed" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/create/visibility" element={<VisibilitySelect />} />
          <Route path="/create/format" element={<FormatSelect />} />
          <Route path="/create/payment" element={<PaymentSelect />} />
          <Route path="/create/form" element={<EventCreateForm />} />
          <Route path="/create/review" element={<ReviewEvent />} />

          <Route path="/dashboard">
            <Route index element={<OverviewPage />} />
            <Route path="event/:id" element={<DashboardEventPage />}>
              <Route index element={<EventOverviewPage />} />
              <Route path="guests" element={<EventGuestsPage />} />
            </Route>
          </Route>

          <Route path="/admin/review" element={<AdminReviewPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
