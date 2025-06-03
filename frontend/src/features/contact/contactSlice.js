import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Thunk to fetch users based on search query
export const fetchUsers = createAsyncThunk(
  "contacts/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Access searchQuery from Redux state
      const { searchQuery } = getState().contact;
      const res = await api.get(`/contact/users?search=${searchQuery}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().contact;
    try {
      const res = await api.get("/contact");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToContacts = createAsyncThunk(
  "contacts/addToContacts",
  async (user, { getState, rejectWithValue }) => {
    try {
      const res = await api.post(`/contact/${user._id}`);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  users: [],
  searchQuery: "",
  loading: false,
  onlineUsers: [],
  error: null,
  user: null,
  currentChat : {},
  showAddContactPopup: false,
};

// Redux slice
const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setShowAddContactPopup: (state, action) => {
      state.showAddContactPopup = !state.showAddContactPopup;
    },
    setCurrentChat : (state , action)=>{
      state.currentChat = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //fetching contacts
      .addCase(fetchContacts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        const conatcts = action.payload.data.map(
          (conatct) => conatct.recipient
        );
        state.onlineUsers = conatcts;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //addcontacts
      .addCase(addToContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.onlineUsers = [action.payload, ...state.onlineUsers];
        state.searchQuery = "";
        state.showAddContactPopup = false;
      })
      .addCase(addToContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setSearchQuery, setShowAddContactPopup , setCurrentChat } = contactSlice.actions;
export const useContact = (state) => state.contact;
export default contactSlice.reducer;
