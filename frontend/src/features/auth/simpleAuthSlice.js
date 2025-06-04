import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import validate from "./authValidation";
import { baseUrl } from "../../utils/constants";

// Async action (thunk) to simulate an API call
export const submitForm = createAsyncThunk(
  "simpleAuth/submitForm",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().simpleAuth;
    const errors = validate(state, "register");
    if (Object.values(errors).some((e) => e)) {
      return rejectWithValue({ errors: errors });
    }
    const { name, email, password } = state;
    try {
      const res = await api.post(`/user/register`, { name, email, password });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      return rejectWithValue({ apiError: message });
    }
  }
);

export const loginForm = createAsyncThunk(
  "simpleAuth/loginForm",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().simpleAuth;
    const errors = validate(state, "login");
    console.log(errors);

    if (Object.values(errors).some((e) => e)) {
      return rejectWithValue({ errors: errors });
    }
    const { email, password } = state;
    try {
      const res = await api.post(`/user/login`, { email, password });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Login Failed";
      return rejectWithValue({ apiError: message });
    }
  }
);

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  user: null,
  token: null,
  error: null,
  errors: {},
  showPassword: false,
  isSubmitting: false,
  backendError: "",
  successMessage: "",
};

const simpleAuthSlice = createSlice({
  name: "simpleAuth",
  initialState,
  reducers: {
    toggleShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    handleChangeUser: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    clearErrors: (state) => {
      state.backendError = "";
      state.successMessage = "";
    },

    handleGoogleSignIn: () => {
      window.location.href = `${baseUrl}/user/google`;
    },
    logOut : ()=>{
      localStorage.removeItem("authToken");
    },
    setUser : (state , action)=>{
       state.user = action.payload;
    }
   
  },
  extraReducers: (builder) => {
    //registration cases
    builder
      .addCase(submitForm.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        console.log(action.payload);

        state.isSubmitting = false;
        state.successMessage = action.payload.message;
        state.name = "";
        state.password = "";
        state.email = "";

        state.errors = {};
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.backendError = action.payload.apiError;
        state.errors = action.payload.errors;
      })

      //login cases
      .addCase(loginForm.pending, (state, action) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(loginForm.fulfilled, (state, action) => {
        console.log("login payload", action.payload.message);

        state.isSubmitting = false;
        state.errors = {};
        state.email = "";
        state.successMessage = action.payload.message;
        state.password = "";
        state.token = `Bearer ${action?.payload?.token}`;
        state.user = action.payload.user;
        localStorage.setItem("authToken", `Bearer ${action?.payload?.token}`);
        localStorage.setItem("userId", action?.payload?.user?.id)
      })
      .addCase(loginForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errors = action.payload.errors;
        console.log("action.payload", action.payload);

        state.backendError = action.payload.apiError;
      });
  },
});

export const {
  toggleShowPassword,
  handleChangeUser,
  clearErrors,
  handleGoogleSignIn,
  logOut,
  setUser
} = simpleAuthSlice.actions;
export const selectSimpleAuth = (state) => state.simpleAuth;
export default simpleAuthSlice.reducer;

// 🔧 Utility function
