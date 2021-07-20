import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: JSON.parse(window.localStorage.getItem('user')),
    doctor:JSON.parse(window.localStorage.getItem('doctor')),
    darkMode:false,
    documentName:JSON.parse(window.localStorage.getItem('documentName'))
  },
  reducers: {
    loginUser:(state,action)=>{
      state.value=action.payload;
      const data=JSON.stringify(action.payload);
      window.localStorage.setItem('user',data);

    },
    loginDoc:(state,action)=>{
      state.doctor=action.payload;
      const data=JSON.stringify(action.payload);
      window.localStorage.setItem('doctor',data);

    },
    logoutUser:(state)=>{
      state.value=null;
      window.localStorage.setItem('user',null);
    },
    logoutDoctor:(state)=>{
      state.doctor=null;
      window.localStorage.setItem('doctor',null);
    },
    darkmode:(state)=>{
      state.darkMode=!state.darkMode;
      const data=JSON.stringify(state.darkMode);
      window.localStorage.setItem('darkMode',data);
    },
    documentGet:(state,action)=>{
      state.documentName=action.payload;
      const data=JSON.stringify(action.payload);
      window.localStorage.setItem('documentName',data);
    }

  }
});

export const { loginDoc,loginUser,logoutDoctor ,logoutUser, darkmode,documentGet } = userSlice.actions;
export const userEmail=(state)=>state.user.value
export default userSlice.reducer;
