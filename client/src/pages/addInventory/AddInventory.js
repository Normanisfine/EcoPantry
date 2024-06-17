import React, { useState } from 'react';
import InventoryForm from '../../components/Inventory/inventoryForm/InventoryForm';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { createInventory, selectIsLoading } from '../../redux/features/inventory/inventorySlice';
import Loader from '../../components/loader/Loader';


//LATER: add unit here
const initialState = {
    name: "",
    category: "",
    quantity: "",
    price: "",
}

const AddInventory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [inventory, setInventory] = useState(initialState);
    const [inventoryImage, setInventoryImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState("");

    const isLoading = useSelector(selectIsLoading);

    const {name, category, price, quantity} = inventory

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInventory({ ...inventory, [name]: value });
      };

    const handleImageChange = (e) => {
        setInventoryImage(e.target.files[0]);
        setImagePreview(URL.createObjectURL(e.target.files[0]))
    };

    const generateSKU = (category) => {
        const letter = category.slice(0, 3).toUpperCase();
        const number = Date.now()
        const sku = letter + "-" + number;
        console.log(sku)
        return sku;
    };

    const saveInventory = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", generateSKU(category));
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("image", inventoryImage);

        console.log(...formData);

        await dispatch(createInventory(formData))

        navigate("/dashboard");

    }



  return (
    <div>
        {isLoading && <Loader />}
        <h3 className="--mt">Add New Food Inventory</h3>
        <InventoryForm
        inventory={inventory} 
        inventoryImage={inventoryImage} 
        imagePreview = {imagePreview} 
        description={description} 
        setDescription={setDescription} 
        handleInputChange={handleInputChange} 
        handleImageChange={handleImageChange} 
        saveInventory={saveInventory}
         />
    </div>
  )
}

export default AddInventory