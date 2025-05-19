import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' ou 'error'
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/login/', { email, password })
      .then(response => {
        setMessageType('success');
        setMessage(response.data.message || 'Connexion réussie !');
        localStorage.setItem('email', email);
        setTimeout(() => {
          setMessage(null);
          navigate('/home');
        }, );
      })
      .catch(error => {
        setMessageType('error');
        setMessage(error.response?.data?.message || 'Erreur lors de la connexion');
        setTimeout(() => setMessage(null), 3000);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 flex items-center justify-center relative overflow-hidden">
      <img
        src="https://source.unsplash.com/1600x900/?technology,login"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
      />

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up transition-transform transform hover:scale-[1.01] relative"
      >
        {message && (
          <div className={`absolute top-[-60px] left-0 right-0 mx-auto w-full max-w-md px-4`}>
            <div className={`text-center py-2 rounded-lg font-semibold shadow-md transition-opacity duration-500
              ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}
            `}>
              {message}
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Connexion</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-600">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-pink-600 transition duration-300 shadow-lg"
        >
          Se connecter
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Pas de compte ?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Créez-en un ici
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
