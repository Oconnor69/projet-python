import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [search, setSearch] = useState('');

  const fetchBlogs = async (query = '') => {
    try {
      const response = await axios.get(`http://localhost:8000/api/blogs/?search=${query}`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Erreur de chargement des blogs :', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchBlogs(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section - Réduit */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Découvrez nos Blogs</h1>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Rechercher un blog..."
                value={search}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-3">
          <a href="/profile" className="group flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <svg className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-gray-700 text-sm">Mon profil</span>
          </a>
          <a href="/blog-manager" className="group flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <svg className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-medium text-gray-700 text-sm">Gérer mes blogs</span>
          </a>
        </div>
      </div>

      {/* Blog Grid - Nouveau style */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
            >
              {blog.image && (
                <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <a href={`/auteur/${blog.auteur_id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    {blog.auteur}
                  </a>
                </p>
                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Lire l'article</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl relative transform transition-all duration-300 scale-100">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              {selectedBlog.image && (
                <div className="md:w-1/2">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{selectedBlog.title}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <a
                    href={`/auteur/${selectedBlog.auteur_id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {selectedBlog.auteur}
                  </a>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{selectedBlog.content}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Publié le {selectedBlog.created_at}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
