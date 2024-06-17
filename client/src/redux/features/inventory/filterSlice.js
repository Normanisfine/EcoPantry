import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filteredInventories: []

}

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_INVENTORIES(state, action) {
        const {inventories, search} = action.payload;
        const tempInventories = inventories.filter((inventory) => inventory.name.toLowerCase().includes(search.toLowerCase()) || inventory.category.toLowerCase().includes(search.toLowerCase()));

        state.filteredInventories = tempInventories;
    }
  }
});

export const { FILTER_INVENTORIES } = filterSlice.actions;

export const selectFilteredInventories = (state) => state.filter.filteredInventories;

export default filterSlice.reducer