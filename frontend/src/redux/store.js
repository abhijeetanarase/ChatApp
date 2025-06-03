import { configureStore } from "@reduxjs/toolkit";
import  simpleAuthSlice  from "../features/auth/simpleAuthSlice";
import contactSlice from "../features/contact/contactSlice"
import chatSlice  from  "../features/chat/chatSlice"


const store =  configureStore({
    reducer : {
     simpleAuth :simpleAuthSlice,
     contact : contactSlice,
     chat : chatSlice
    }
})

export default store;