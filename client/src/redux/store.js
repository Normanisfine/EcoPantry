import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import inventoryReducer from "./features/inventory/inventorySlice";
import filterReducer from "./features/inventory/filterSlice"


export const store = configureStore({
    reducer:{
        auth: authReducer,
        inventory: inventoryReducer,
        filter: filterReducer
    }
});