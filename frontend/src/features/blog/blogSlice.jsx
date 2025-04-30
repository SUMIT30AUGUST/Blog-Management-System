import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../api/apiConfig';

// Get token from localStorage
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Fetch blogs with pagination
export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async (page, thunkAPI) => {
  try {
    const response = await axios.get(`${API.BLOG_LIST}?page=${page}`, getAuthHeader());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
  }
});

  //delete   blog by ID
export const deleteBlog = createAsyncThunk('blog/deleteBlog', async (id, thunkAPI) => {
  try {
    await axios.delete(API.DELETE_BLOG, {
      ...getAuthHeader(),
      data: { id },
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
  }
});

//search bloggs 
export const searchBlogs = createAsyncThunk('blog/searchBlogs', async (keyword, thunkAPI) => {console.log(keyword)
  try {
    const response = await axios.get(API.SEARCH_KEYWORD(keyword), getAuthHeader());
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Search failed');
  }
});

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    totalBlogs: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      //Fetching blogs 
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.totalBlogs = action.payload.totalBlogs;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        state.totalBlogs -= 1;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.payload;
      })

      //Search blogs
      .addCase(searchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action?.payload;
        state.totalBlogs = action?.payload?.length;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
