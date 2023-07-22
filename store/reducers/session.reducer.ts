import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    Token,
    User,
} from '../../common/types';

type InitialState = {
    token: Token;
};

const initialState: InitialState = {
    token: {
        token: null,
        expiresIn: null,
        refreshToken: null,
    },
};

const sessionReducer = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<{
            token: Token;
            user: User;
        }>) => {
            state.token = action.payload.token;
        },
        clearToken: () => {
            return initialState;
        }
    },
});

export const {
    setToken,
    clearToken,
} = sessionReducer.actions;

export default sessionReducer.reducer;
