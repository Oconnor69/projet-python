import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [profil, setProfil] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    bio: '',
    password: '',
    photo: null
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchProfile = async (email) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/auteur/profil/?email=${email}`);
      setProfil(res.data);
      setFormData({
        prenom: res.data.prenom || '',
        nom: res.data.nom || '',
        bio: res.data.bio || '',
        password: '',
        photo: null
      });
    } catch (err) {
      console.error('Erreur lors du chargement du profil :', err);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      fetchProfile(email);
    } else {
      console.error("Aucun email trouvé dans le localStorage");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    const updateForm = new FormData();
    updateForm.append('email', email);
    updateForm.append('prenom', formData.prenom);
    updateForm.append('nom', formData.nom);
    updateForm.append('bio', formData.bio);
    if (formData.password) updateForm.append('password', formData.password);
    if (formData.photo) updateForm.append('photo', formData.photo);

    try {
      await axios.put('http://localhost:8000/api/auteur/modifier/', updateForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsEditing(false);
      fetchProfile(email);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil :', err);
    }
  };

  if (!profil) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement du profil...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* En-tête avec photo et nom */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {profil.photo ? (
                  <img
                    src={profil.photo}
                    alt="Profil"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-indigo-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 right-8">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white hover:bg-gray-100 text-indigo-600 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEditing ? 'Annuler' : 'Modifier le profil'}
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="pt-20 px-8 pb-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">{profil.prenom} {profil.nom}</h1>
              <p className="text-gray-600 mt-1">{profil.email}</p>
            </div>

            {!isEditing ? (
              // Affichage des informations
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Biographie</h3>
                  <p className="text-gray-600">{profil.bio || "Aucune biographie disponible"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations personnelles</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Prénom</p>
                      <p className="text-gray-800">{profil.prenom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="text-gray-800">{profil.nom}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Formulaire de modification
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    placeholder="Parlez-nous de vous..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Laissez vide pour ne pas changer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Télécharger une photo</span>
                          <input
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Notification de succès */}
        {updateSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Profil mis à jour avec succès !</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
