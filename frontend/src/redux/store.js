import { configureStore } from "@reduxjs/toolkit";
import  simpleAuthSlice  from "../features/auth/simpleAuthSlice";
import contactSlice from "../features/contact/contactSlice"
import chatSlice  from  "../features/chat/chatSlice"
import sideBarSlice   from "../features/sidebar/siderBarSlice"
import invitationsReducer from "../features/invitations/invitationsSlice";


const store =  configureStore({
    reducer : {
     simpleAuth :simpleAuthSlice,
     contact : contactSlice,
     chat : chatSlice,
     sidebar : sideBarSlice,
     invitations: invitationsReducer,
    }
})

export default store;