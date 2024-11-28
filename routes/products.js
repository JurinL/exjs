var express = require("express");
var router = express.Router();
var productSchema = require("../models/product.model");
const multer = require("multer");
const path = require("path");


// Multer configuration
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// GET all products
router.get("/", async function (req, res, next) {
  let products = await productSchema.find({});
  res.send(products);
});

//Get product by productId
router.get("/:id", async function (req, res, next) {
  try {
    const product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
      });
    }
    return res.status(200).send({
      data: product,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

// Create Product Data
router.post("/", async function (req, res, next) {
  const { productName, description, price, stock } = req.body;
  const newProduct = new productSchema({
    productName,
    description,
    price,
    stock,
  });

  try {
    if (newProduct.price < 0 || newProduct.stock < 0) {
      return res
        .status(400)
        .send({ error: "Product price or stock can't be lower than 1" });
    }
    await newProduct.save();
    res
      .status(201)
      .send({ message: "Create Product Success!", data: newProduct });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get product image
router.get("/:id/image", async (req, res) => {
  try {
    const product = await productSchema.findById(req.params.id);
    
    if (!product || !product.image) {
      return res.status(404).send({
        message: "Image not found",
        success: false
      });
    }

    res.set('Content-Type', product.image.contentType);
    res.send(Buffer.from(product.image.data, 'base64'));
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving image",
      success: false,
      error: error.message
    });
  }
});

// Upload product image
router.post("/:id/image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        message: "No image file provided",
        success: false
      });
    }

    const imageData = {
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype
    };

    const product = await productSchema.findByIdAndUpdate(
      req.params.id,
      { image: imageData },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
        success: false
      });
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      success: true,
      imageUrl: `/api/products/${req.params.id}/image`
    });
  } catch (error) {
    res.status(500).send({
      message: "Error uploading image",
      success: false,
      error: error.message
    });
  }
});


// Update product data
router.put("/:id", async function (req, res, next) {
  let { productName, description, price, stock } = req.body;

  let product = await productSchema.findByIdAndUpdate(
    req.params.id,
    { productName, description, price, stock },
    { new: true }
  );
  res.send(product);
});

// Delete product
router.delete("/:id", async function (req, res, next) {
  let product = await productSchema.findByIdAndDelete(req.params.id);

  res.send(product);
});

module.exports = router;


