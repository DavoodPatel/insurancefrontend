import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import DoctorDashboard from './pages/DoctorDashboard';
import ClaimHistory from './pages/ClaimHistory'
import DoctorLogin from './pages/DoctorLogin';
import AddPackage from './pages/AddPackage';
import ViewPackages from './pages/ViewPackages';
import ViewPatients from './pages/ViewPatients';
import ClaimInsurance from './pages/ClaimInsurance'
import HRLogin from './pages/HRLogin';
import HrDashboard from './pages/HrDashboard';
import HrReferPatientDashboard from './pages/HrReferPatientDashboard';
import Packages from './pages/Packages';
import CreateHR from './pages/CreateHR';
import ViewStats from './pages/ViewStats';
import UserUpdate from './pages/UserUpdate'
import ViewHRs from './pages/ViewHRs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/add-package" element={<AddPackage />}/>
        <Route path="/view-packages" element={<ViewPackages />}/>
        <Route path="/view-patients" element={<ViewPatients/>}/>
        <Route path="/claim-insurance" element={<ClaimInsurance />} />
        <Route path="/claim-history" element={<ClaimHistory />} />
        <Route path="/hr-login" element={<HRLogin />} />
        <Route path="/hr-dashboard" element={<HrDashboard />} />
        <Route path="/hr-refer-patient-dashboard" element={<HrReferPatientDashboard />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/create-hr" element={<CreateHR />} />
        <Route path="/view-stats" element={<ViewStats />} />
        <Route path="/user-update" element={<UserUpdate />} />
        <Route path="/view-hrs" element={<ViewHRs />} />
      </Routes>
    </Router>
  );
}

export default App;
