import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../features/blog/blogSlice';
import { searchBlogs } from '../features/blog/blogSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, totalBlogs, loading, error } = useSelector((state) => state.blog);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const token = localStorage.getItem('token');

  // Fetch blogs when component mounts or page changes
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchBlogs(currentPage));
  }, [dispatch, currentPage, navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEdit = (id) => {
    navigate(`/blog/edit/${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (confirmDelete) {
      dispatch(deleteBlog(id));
    }
  };

  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <nav className="navbar-sticky">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => {
              // if (search.trim()) dispatch(searchBlogs(search.trim()));
              dispatch(searchBlogs(search.trim()));
          }}>Search</button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* ADD BLOG */}
      <div className="add-blog-wrapper">
        <button className="add-blog-btn-fixed" onClick={() => navigate('/blog/create')}>
          + Add Blog
        </button>
      </div>

      {/* LOADING / ERROR / BLOG LIST */}
      {loading ? (
        <p style={{marginTop:'70px'}}>Loading...</p>
      ) : error ? (
        <p style={{ marginTop:'70px',color: 'red' }}>{error}</p>
      ) : (
        <div className="blog-list">
          {blogs?.length ? (
            blogs.map((blog) => (
              <div className="blog-card" key={blog._id}>
                {blog.image && (
                  <img
                    src={`http://localhost:5000/images/${blog.image}`}
                    alt={blog.title}
                    className="blog-image"
                  />
                )}
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                  <p className="author">By: {blog.author}</p>

                  <button className="edit-btn" onClick={() => handleEdit(blog._id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(blog._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found.</p>
          )}
        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;








