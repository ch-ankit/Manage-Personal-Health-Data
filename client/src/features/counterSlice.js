import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: JSON.parse(window.localStorage.getItem('user')),
    darkMode:false
  },
  reducers: {
    login:(state,action)=>{
      state.value=action.payload;
      const data=JSON.stringify(action.payload);
      window.localStorage.setItem('user',data);

    },

    logout:(state)=>{
      state.value=null;
      window.localStorage.setItem('user',null);
    },
    darkmode:(state)=>{
      state.darkMode=!state.darkMode;
    }

  }
});

export const { login, logout, darkmode } = userSlice.actions;
export const userEmail=(state)=>state.user.value
export default userSlice.reducer;
