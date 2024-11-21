import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

function Home() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProtectedData = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const res = await axios.get('http://localhost:5002/api/protected', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMessage(res.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        await handleTokenRefresh();
      } else {
        console.error('Error fetching protected data:', error);
      }
    }
  };

  const handleTokenRefresh = async () => {
    try {
      const res = await axios.post('http://localhost:5002/api/refresh-token', {}, { withCredentials: true });
      localStorage.setItem('accessToken', res.data.accessToken);
      await fetchProtectedData();
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await axios.post('http://localhost:5002/api/logout', {}, { withCredentials: true });
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  return (
    <div>
      <nav className="bg-success d-flex justify-content-between p-2">
        <h2 className="text-light">Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </nav>
      <main className="text-light">
        <p>Welcome to the dashboard</p>
        <p>{message}</p>
      </main>
    </div>
  );
}

export default Home;
