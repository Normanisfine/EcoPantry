import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./InventoryForm.scss"
import Card from '../../card/Card';

const InventoryForm = ({inventory, 
    inventoryImage, 
    imagePreview, 
    description, 
    setDescription, 
    handleInputChange, 
    handleImageChange, 
    saveInventory}) => {
  return (
    <div className="add-product">
        <Card cardClass={"card"} >
            <form onSubmit={saveInventory}>
                <Card cardClass={"group"}>
                    <label>Food Inventory Image</label>
                    <code className="--color-dark">Supported Formats: jpg, jpeg, png</code>
                    <input type="file" name="image" onChange={(e) => handleImageChange(e)} />

                    {imagePreview != null ? (
                       <div className="image-preview">
                        <img src={imagePreview} alt="Food Inventory Image" />
                       </div> 
                    ) : (<p>No image set for this product.</p>)}
                </Card>
                
                <label>Food Name: </label>
                <input 
                    type="text" 
                    placeholder="Food Name" 
                    name="name" 
                    value={inventory?.name} 
                    onChange={handleInputChange} />
                
                <label>Category: </label>
                <input 
                    type="text" 
                    placeholder="Food Category" 
                    name="category" 
                    value={inventory?.category} 
                    onChange={handleInputChange} />

                <label>Total Price: </label>
                <input 
                    type="text" 
                    placeholder="Food Price" 
                    name="price" 
                    value={inventory?.price} 
                    onChange={handleInputChange} />

                <label>Quantity: </label>
                <input 
                    type="text" 
                    placeholder="Food Quantity" 
                    name="quantity" 
                    value={inventory?.quantity} 
                    onChange={handleInputChange} />

                <label>Food Description</label>
                <ReactQuill theme="snow" 
                value={description} 
                onChange={setDescription} 
                modules={InventoryForm.modules} 
                formats={InventoryForm.formats} />

                <div className='--my'>
                    <button type="submit" className='--btn --btn-primary'>
                        Save it to your EcoPantry!
                    </button>
                </div>

            </form>
        </Card>
    </div>
  )
};

InventoryForm.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "video",
    "image",
    "code-block",
    "align",
  ];

export default InventoryForm