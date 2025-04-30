import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api/apiConfig';
import '../styles/EditBlog.css';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    author: '',
    image: '', // This stores the image URL
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API.BLOG_BY_ID(id)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(response.data.blogs);
        setPreview(response.data.blogs.image);
      } catch (err) {
        setError('Failed to fetch blog');
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('id', id);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('author', form.author);

      if (imageFile) {
        formData.append('image', imageFile); // for actual upload
      } else {
        formData.append('image', form.image); // fallback to original
      }

      await axios.put(`${API.UPDATE_BLOG}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/');
    } catch (err) {
      setError('Failed to update blog/try different blog name');
    }
  };

  return (
    <div className="edit-blog-container">
      <h2>Edit Blog</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleUpdate} encType="multipart/form-data">
  <label htmlFor="title">Title</label>
  <input
    type="text"
    id="title"
    name="title"
    placeholder="Title"
    value={form.title}
    onChange={handleChange}
    required
  />

  <label htmlFor="description">Short Description</label>
  <textarea
    id="description"
    name="description"
    placeholder="Description"
    value={form.description}
    onChange={handleChange}
    required
  />

  <label htmlFor="image">Upload Image</label>
  <input
    type="file"
    id="image"
    accept="image/*"
    onChange={handleImageChange}
  />

  {preview && (
    <img
      src={
        preview.startsWith('blob:')
          ? preview
          : `http://localhost:5000/images/${preview}`
      }
      alt="Preview"
      className="edit-blog-preview"
    />
  )}
<br/>
<br/>
  <label style={{fontWeight:'bold',fontSize:'22px'}} htmlFor="author">Author</label>
  <div style={{fontSize:'19px'}}>{form.author}</div>
<br/>

  <button type="submit">Update Blog</button>
</form>

    </div>
  );
};

export default EditBlog;
