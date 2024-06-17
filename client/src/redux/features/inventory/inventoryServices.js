import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/inventory/`;

// create new inventory
const createInventory = async (formData) => {
    const response = await axios.post(API_URL, formData);
    return response.data;
};

// Get all inventories
const getInventories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Delete a inventory
const deleteInventory = async (id) => {
    const response = await axios.delete(API_URL + id);
    return response.data;
  };

// Get an Inventory
const getInventory = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
  };

// Update Inventory
const updateInventory = async (id, formData) => {
    const response = await axios.patch(`${API_URL}${id}`, formData);
    return response.data;
  };

const inventoryService = {
    createInventory,
    getInventories,
    deleteInventory,
    getInventory,
    updateInventory
};

export default inventoryService;