import React, { useEffect, useState } from "react";
import axios from "axios";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
    id: null,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    blogId: null,
    blogTitle: "",
  });
  const [editSuccess, setEditSuccess] = useState({
    show: false,
    blogTitle: "",
  });

  const email = localStorage.getItem("email");
  const API_BASE = "http://127.0.0.1:8000/api";

  const fetchBlogs = async () => {
    try {
      if (!email) return;
      const res = await axios.get(`${API_BASE}/user-blogs/?email=${email}`);
      setBlogs(res.data);
    } catch (error) {
      console.error("Erreur de récupération des blogs :", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setForm({ title: "", content: "", image: null, id: null });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("email", email);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (form.id) {
        await axios.put(`${API_BASE}/update-blog/${form.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditSuccess({
          show: true,
          blogTitle: form.title,
        });
        setTimeout(() => {
          setEditSuccess({ show: false, blogTitle: "" });
        }, 3000);
      } else {
        await axios.post(`${API_BASE}/create-blog/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Erreur lors de la soumission du blog :", error);
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      image: null,
      id: blog.id,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (blog) => {
    setDeleteConfirmation({
      show: true,
      blogId: blog.id,
      blogTitle: blog.title,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE}/delete-blog/${deleteConfirmation.blogId}/`);
      setDeleteConfirmation({ show: false, blogId: null, blogTitle: "" });
      fetchBlogs();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ show: false, blogId: null, blogTitle: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center">Gestion de vos Blogs</h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Bouton flottant pour afficher le formulaire */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {form.id ? "✏️ Modifier un blog" : "➕ Créer un nouveau blog"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  placeholder="Entrez le titre de votre blog"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                <textarea
                  placeholder="Écrivez le contenu de votre blog"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Télécharger une image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                  form.id
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {form.id ? "Mettre à jour le blog" : "Publier le blog"}
              </button>
            </form>
          </div>
        )}

        {/* Liste des blogs */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Image du blog avec overlay */}
              <div className="relative h-56 overflow-hidden">
                {blog.image ? (
                  <img
                    src={`http://127.0.0.1:8000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Contenu du blog */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                  {blog.content}
                </p>

                {/* Boutons d'action */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteClick(blog)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Badge de statut */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-indigo-600 rounded-full shadow-sm">
                  {new Date(blog.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer le blog "{deleteConfirmation.blogTitle}" ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification de succès de modification */}
      {editSuccess.show && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Le blog "{editSuccess.blogTitle}" a été modifié avec succès !</span>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
