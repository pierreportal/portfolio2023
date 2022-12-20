import { PayloadAction } from '@reduxjs/toolkit';
import { IHomeState } from './homeSlice';

export const homeReducers = {
    increment: (state: IHomeState): void => {
        state.testValue += 1;
    },
    incrementByAmount: (state: IHomeState, action: PayloadAction<number>): void => {
        state.testValue += action.payload;
    },
    decrement: (state: IHomeState): void => {
        state.testValue -= 1;
    },
};
