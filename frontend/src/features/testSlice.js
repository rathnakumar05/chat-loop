import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0,
    loading: 'N'
}

export const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        testclick: (state, action) => {
            console.log(state.loading);
            console.log(action.payload);
        },
        countclick: (state, action) => {
            state.count = state.count + 1;
        }
    }
});

export const { testclick, countclick } = testSlice.actions;

export default testSlice.reducer;