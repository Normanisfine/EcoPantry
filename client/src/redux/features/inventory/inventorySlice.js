import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from './inventoryServices';
import { toast } from 'react-toastify';


const initialState = {
    inventory: [],
    inventories: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    totalStoreValue: 0,
    outOfStock: 0,
    category: []

};

// create new inventory

export const createInventory = createAsyncThunk(
    "inventory/create",
    async (formData, thunkAPI) => {
        try {
            return await inventoryService.createInventory(formData)
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message)
            };

    }
);

// Get all inventories
export const getInventories = createAsyncThunk(
    "inventory/getAll",
    async (formData, thunkAPI) => {
        try {
            return await inventoryService.getInventories()
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message)
            };

    }
);

// Delete an Inventory
export const deleteInventory = createAsyncThunk(
    "inventory/delete",
    async (id, thunkAPI) => {
      try {
        return await inventoryService.deleteInventory(id);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

// Get an Inventory
export const getInventory = createAsyncThunk(
    "inventory/getInventory",
    async (id, thunkAPI) => {
      try {
        return await inventoryService.getInventory(id);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  // Update inventory
    export const updateInventory = createAsyncThunk(
    "inventory/updateInventory",
    async ({ id, formData }, thunkAPI) => {
      try {
        return await inventoryService.updateInventory(id, formData);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(message);
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  


const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    CALC_STORE_VALUE(state, action) {
        const inventories = action.payload;
      const array = [];
      inventories.map((item) => {
        const { price, quantity } = item;
        const inventoryValue = price * quantity;
        return array.push(inventoryValue);
      });
      const totalValue = array.reduce((a, b) => {
        return a + b;
      }, 0);
      state.totalStoreValue = totalValue;
    },
    CALC_OUTOFSTOCK(state, action) {
        const inventories = action.payload;
        const array = [];
        inventories.map((item) => {
          const { quantity } = item;
  
          return array.push(quantity);
        });
        let count = 0;
        array.forEach((number) => {
          if (number === 0 || number === "0") {
            count += 1;
          }
        });
        state.outOfStock = count;
      },
      CALC_CATEGORY(state, action) {
        const inventories = action.payload;
        const array = [];
        inventories.map((item) => {
          const { category } = item;
  
          return array.push(category);
        });
        const uniqueCategory = [...new Set(array)];
        state.category = uniqueCategory;
      },
  },
  extraReducers:(builder) => {
    builder
        .addCase(createInventory.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createInventory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action.payload);
            state.inventories.push(action.payload);
            toast.success("Inventory added successfully.")
        })
        .addCase(createInventory.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.error(action.payload)
        })
        // for get all inv
        .addCase(getInventories.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getInventories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            console.log(action.payload);
            state.inventories = action.payload;
        })
        .addCase(getInventories.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.error(action.payload)
        })
        .addCase(deleteInventory.pending, (state) => {
            state.isLoading = true;
          })
        .addCase(deleteInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Inventory deleted successfully");
        })
        .addCase(deleteInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
        })
        .addCase(getInventory.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(getInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.inventory = action.payload;
        })
        .addCase(getInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
        })
        .addCase(updateInventory.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(updateInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Inventory updated successfully");
        })
        .addCase(updateInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
        });


  }
});

export const {CALC_STORE_VALUE, CALC_OUTOFSTOCK, CALC_CATEGORY} = inventorySlice.actions

export const selectIsLoading = (state) => state.inventory.isLoading;
export const selectInventory = (state) => state.inventory.inventory;
export const selectTotalStoreValue = (state) => state.inventory.totalStoreValue;
export const selectOutOfStock = (state) => state.inventory.outOfStock;
export const selectCategory = (state) => state.inventory.category;

export default inventorySlice.reducer