import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    photo: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.prenom) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.nom) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'photo' && files[0]) {
      setFormData(prev => ({ ...prev, photo: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword' && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:8000/api/register/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: response.data.message });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de l\'inscription'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-white to-purple-100 flex items-center justify-center relative overflow-hidden py-12">
      {/* Background image */}
      <img
        src="https://source.unsplash.com/1600x900/?user,profile"
        alt="Register Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
      />

      <form
        onSubmit={handleRegister}
        encType="multipart/form-data"
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up transition-transform transform hover:scale-[1.01]"
      >
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Créer un compte</h2>

        <div className="space-y-6">
          {/* Photo de profil */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="w-full h-full rounded-full object-cover border-4 border-purple-200"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-4 border-purple-200">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-lg transition-colors">
              <span>Choisir une photo</span>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
             
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors
                  ${errors.prenom ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}`}
                placeholder="Votre prénom"
              />
              {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
            </div>

            <div>
             
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors
                  ${errors.nom ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}`}
                placeholder="Votre nom"
              />
              {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
            </div>
          </div>

          <div>
           
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors
                ${errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}`}
              placeholder="Votre email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
           
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors
                ${errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}`}
              placeholder="Votre mot de passe"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors
                ${errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'}`}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div>
           
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors resize-none"
              placeholder="Parlez-nous de vous..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-gradient-to-r from-green-500 to-purple-500 text-white rounded-lg font-semibold 
              hover:from-green-600 hover:to-purple-600 transition duration-300 shadow-lg flex items-center justify-center
              ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création du compte...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <a href="/" className="text-blue-500 hover:underline">
              Connectez-vous ici
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
