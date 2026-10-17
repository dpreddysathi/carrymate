import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BrowseRequests } from './pages/BrowseRequests';
import { BrowseTrips } from './pages/BrowseTrips';
import { Dashboard } from './pages/Dashboard';
import { DealDetail } from './pages/DealDetail';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NewRequest } from './pages/NewRequest';
import { NewTrip } from './pages/NewTrip';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { RequestDetail } from './pages/RequestDetail';
import { TripDetail } from './pages/TripDetail';

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<BrowseTrips />} />
            <Route path="/trips/new" element={<ProtectedRoute><NewTrip /></ProtectedRoute>} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/requests" element={<BrowseRequests />} />
            <Route path="/requests/new" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/deals/:id" element={<ProtectedRoute><DealDetail /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          <span>
            CarryMate · travelers carry, shoppers save · duty figures are
            estimates only
          </span>
        </footer>
      </div>
    </HashRouter>
  );
}
