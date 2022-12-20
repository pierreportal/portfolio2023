import { createSlice } from '@reduxjs/toolkit';
import { homeReducers } from './reducers';

export interface IHomeState {
    testValue: number;
}

const initialState: IHomeState = {
    testValue: 0,
};

export const HomeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: homeReducers,
});

export const { incrementByAmount, decrement, increment } = HomeSlice.actions;
export const { reducer } = HomeSlice;
