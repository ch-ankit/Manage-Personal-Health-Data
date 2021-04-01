import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/counterSlice';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
