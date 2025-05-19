import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AuteurProfile() {
  const { auteurId } = useParams();
  const [auteur, setAuteur] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/auteur/${auteurId}/`)
      .then(response => {
        setAuteur(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement du profil de l'auteur :", error);
      });
  }, [auteurId]);

  if (!auteur) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement du profil...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header avec photo de profil */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              {auteur.photo ? (
                <img
                  src={auteur.photo}
                  alt="Photo de l'auteur"
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
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{auteur.prenom} {auteur.nom}</h1>
              <p className="text-indigo-100">{auteur.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Biographie */}
        {auteur.bio && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Biographie
            </h3>
            <p className="text-gray-600 leading-relaxed">{auteur.bio}</p>
          </div>
        )}

        {/* Section Articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Articles publiés
          </h2>

          {auteur.blogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">Aucun article publié pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {auteur.blogs.map(blog => (
                <div key={blog.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {blog.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {blog.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(blog.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuteurProfile;
