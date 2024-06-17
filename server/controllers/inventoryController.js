const asyncHandler = require('express-async-handler');
const inventoryModel = require('../models/inventoryModel');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;

const createInventory = asyncHandler(async (req, res) => {
    const {name, sku, category, quantity, price, description} = req.body;

    // Validation
    if (!name || !category || ! quantity || ! price || !description) {
        res.status(400);
        throw new Error ("Please fill in all required fields")
    }

    // Handle inventory uploaded
    let fileData = {};
    if (req.file) {
        //upload to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "FoodStreet", recource_type: "image"})
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    // create inventory
    const inventory = await inventoryModel.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData
    });

    res.status(201).json(inventory);
});

//get all inventories
const getInventories = asyncHandler(async (req, res) => {
    const inventory = await inventoryModel.find({user: req.user.id}).sort("-createdAt")
    res.status(200).json(inventory)
})

// Get single inventory
const getInventory = asyncHandler(async (req, res) => {
    const inventory = await inventoryModel.findById(req.params.id);
    // if inv does not exist
    if (!inventory) {
        res.status(404)
        throw new Error("Inventory not found")
    };

    // match inv to its user
    if (inventory.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not Authorized")
    }

    res.status(200).json(inventory);
});

// Delete Inv
const deleteInventory = asyncHandler(async (req, res) => {
    const inventory = await inventoryModel.findById(req.params.id);
    // if inv does not exist
    if (!inventory) {
        res.status(404)
        throw new Error("Inventory not found")
    };

    // match inv to its user
    if (inventory.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not Authorized")
    }
    //delete
    await inventoryModel.deleteOne({ _id: inventory._id });
    res.status(200).json({message: "Inventory Deleted"});
});

// Update Inventory
const updateInventory = asyncHandler(async (req, res) => {
    const {name, category, quantity, price, description} = req.body;
    const {id} = req.params

    const inventory = await inventoryModel.findById(id);

    // if inv does not exist
    if (!inventory) {
        res.status(404)
        throw new Error("Inventory not found")
    };

    // match inv to its user
    if (inventory.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not Authorized")
    }


    // Handle inventory uploaded
    let fileData = {};
    if (req.file) {
        //upload to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "FoodStreet", recource_type: "image"})
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    // Update inventory
    const updatedInventory = await inventoryModel.findByIdAndUpdate(
        {_id: id},
        {
            name,
            category,
            quantity,
            price,
            description,
            image: Object.keys(fileData).length === 0 ? inventory?.image : fileData 
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(201).json(updatedInventory);
});

module.exports = {
    createInventory,
    getInventories,
    getInventory,
    deleteInventory,
    updateInventory
};