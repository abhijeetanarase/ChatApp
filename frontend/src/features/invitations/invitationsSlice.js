import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch pending invitations
export const fetchInvitations = createAsyncThunk(
  "invitations/fetchInvitations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/contact/invitations");
      return res.data.invitations;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Accept/Reject invitation
export const respondToInvitation = createAsyncThunk(
  "invitations/respondToInvitation",
  async ({ contactId, action }, { rejectWithValue }) => {
    try {
      await api.post(`/contact/invitation/${contactId}/respond`, { action });
      return { contactId, action };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const invitationsSlice = createSlice({
  name: "invitations",
  initialState: {
    invitations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.invitations = action.payload;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(respondToInvitation.fulfilled, (state, action) => {
        state.invitations = state.invitations.filter(
          (inv) => inv._id !== action.payload.contactId
        );
      });
  },
});

export default invitationsSlice.reducer; 