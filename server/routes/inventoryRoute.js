const express = require('express');
const router = express.Router();
const protect = require('../middleWare/authMiddleware');
const { createInventory, 
    getInventories, 
    getInventory, 
    deleteInventory, 
    updateInventory } = require('../controllers/inventoryController');
const { upload } = require('../utils/fileUpload');


router.post("/", protect, upload.single("image"), createInventory);
router.get("/", protect, getInventories);
router.get("/:id", protect, getInventory);
router.delete("/:id", protect, deleteInventory);
router.patch("/:id", protect, upload.single("image"), updateInventory);

module.exports = router;