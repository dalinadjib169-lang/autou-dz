/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AddCar } from './pages/AddCar';
import { CarDetails } from './pages/CarDetails';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans" dir="rtl">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-car" element={<AddCar />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
