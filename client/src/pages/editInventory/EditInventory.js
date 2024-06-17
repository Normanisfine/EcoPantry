import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams,useNavigate } from 'react-router-dom';
import { getInventories, getInventory, selectInventory, selectIsLoading, updateInventory } from '../../redux/features/inventory/inventorySlice';
import Loader from '../../components/loader/Loader';
import InventoryForm from '../../components/Inventory/inventoryForm/InventoryForm';


const EditInventory = () => {

  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);

  const inventoryEdit = useSelector(selectInventory);

  const [inventory, setInventory] = useState(inventoryEdit);
  const [inventoryImage, setInventoryImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  useEffect (() => {
    dispatch(getInventory(id))
  }, [dispatch, id])

  useEffect(() => {
    setInventory(inventoryEdit);
    setImagePreview(
      inventoryEdit && inventoryEdit.image ? `${inventoryEdit.image.filePath}` : null
    );

    setDescription(
      inventoryEdit && inventoryEdit.description ? inventoryEdit.description : ""
    )

  }, [inventoryEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventory({ ...inventory, [name]: value });
  };

  const handleImageChange = (e) => {
    setInventoryImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]))
};

  const saveInventory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", inventory?.name);
    formData.append("category", inventory?.category);
    formData.append("quantity", inventory?.quantity);
    formData.append("price", inventory?.price);
    formData.append("description", description);
    if (inventoryImage) {
      formData.append("image", inventoryImage);
    }
    console.log(...formData);

    await dispatch(updateInventory({ id, formData }))
    await dispatch(getInventories())

    navigate("/dashboard");
  };

  return (
    <div>
      {isLoading && <Loader />}
        <h3 className="--mt">Edit Inventory</h3>
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

export default EditInventory