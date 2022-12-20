import { configureStore } from '@reduxjs/toolkit';
import { reducer as homeReducer } from '../rooms/Home/homeSlice';

export const store = configureStore({
    reducer: {
        homeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
