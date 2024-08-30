import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./apiService";
import { toast } from "react-toastify";

const initialState = {
  books: [],
  favoriteBooks: [],
  errorMessage: "",
  book: null,
  status: null,
};

export const getBooks = createAsyncThunk(
  "bookStore/getBooks",
  async ({ pageNum, limit, query }) => {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const res = await api.get(url);
    return res.data;
  }
);

export const getDetailBook = createAsyncThunk(
  "bookStore/getDetailBook",
  async ({ bookId }) => {
    const res = await api.get(`/books/${bookId}`);
    return res.data;
  }
);

export const addBookToFavorite = createAsyncThunk(
  "bookStore/AddBookToFavorite",
  async (addingBook) => {
    const res = await api.post(`/favorites`, addingBook);
    return res.data;
  }
);

export const getFavoriteBooks = createAsyncThunk(
  "bookStore/getFavoriteBooks",
  async () => {
    const res = await api.get(`/favorites`);
    return res.data;
  }
);

export const removeFavBook = createAsyncThunk(
  "bookStore/removeFavBook",
  async (removedBookId) => {
    const res = await api.delete(`/favorites/${removedBookId}`);
    return res.data;
  }
);

export const bookStoreSlice = createSlice({
  name: "bookStore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.status = null;
        state.errorMessage = "";
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.state = "failed";
        state.errorMessage = action.error.message;
      });
    builder
      .addCase(getDetailBook.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getDetailBook.fulfilled, (state, action) => {
        state.status = null;
        state.errorMessage = "";
        state.book = action.payload;
      })
      .addCase(getDetailBook.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message;
      });
    builder
      .addCase(addBookToFavorite.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addBookToFavorite.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = null;
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addBookToFavorite.rejected, (state, action) => {
        state.status = "failed";
        toast.error(action.error.message);
      });
    builder
      .addCase(getFavoriteBooks.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getFavoriteBooks.fulfilled, (state, action) => {
        state.status = null;
        state.errorMessage = "";
        state.favoriteBooks = action.payload;
      })
      .addCase(getFavoriteBooks.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message;
      });
    builder
      .addCase(removeFavBook.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeFavBook.fulfilled, (state, action) => {
        state.status = null;
        toast.success("The book has been removed");
      })
      .addCase(removeFavBook.rejected, (state, action) => {
        state.status = "failed";
        state.errorMessage = action.error.message;
      });
  },
});

export const { setQuery } = bookStoreSlice.actions;
export default bookStoreSlice.reducer;
