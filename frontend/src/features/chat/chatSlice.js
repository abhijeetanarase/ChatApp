import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchMessages = createAsyncThunk("chat/messages", async( id , {getState , rejectWithValue} )=>{
    const state = getState.chat;
    try {
      const res =  await api.get(`/message/${id}`)
        return res.data;
    } catch (error) {
       return rejectWithValue(error.message);
    }
});

 const initialState = {
    messages : [],
    loading : false
 }

const chatSlice = createSlice({
  initialState,
  name: "chat",
  reducers: {
    setMessages : (state , action) =>{
        state.messages = [...state.messages , action.payload]
    }
  },
  extraReducers: (builder)=>{
    builder.addCase(fetchMessages.pending , (state )=>{
        state.loading = true;
    }).addCase(fetchMessages.rejected , (state , action)=>{
        state.loading = false
    }).addCase(fetchMessages.fulfilled , (state , action)=>{
        state.messages = action.payload;
        state.loading = false
    })
  }
});

export const useChat = (state) => state.chat;
export const  {setMessages} =  chatSlice.actions;
export default chatSlice.reducer;
