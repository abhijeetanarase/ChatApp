import { createSlice, current } from "@reduxjs/toolkit";


const initialState = {
    activeTab  : "chats",
    currentChat : {}
}
const sideBarSlice = createSlice({
     name : "sidebar" ,
     initialState,
     reducers : {
     setActiveTab :(state , action)=> {
        state.activeTab = action.payload;
     }

     }
})

export const { setActiveTab } = sideBarSlice.actions;
export const useSiderBar = (state) => state.sidebar;
export default sideBarSlice.reducer;