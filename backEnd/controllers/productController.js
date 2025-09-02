import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productsModel.js";

//Add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req?.files?.image1?.[0];
    const image2 = req?.files?.image2?.[0];
    const image3 = req?.files?.image3?.[0];
    const image4 = req?.files?.image4?.[0];
    const images = [image1, image2, image3, image4].filter(Boolean);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return { url: result.secure_url, public_id: result.public_id };
      })
    );

    const productData = {
      name,
      description,
      sizes: JSON.parse(sizes),
      price: Number(price),
      category,
      subCategory,
      bestSeller: bestSeller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "product aded" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//list Products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: "false", message: error.message });
  }
};

//remove product
const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (!product) {
      return res.json({ success: false, message: "product not found" });
    }
    for (let img of product.image) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//fuunction for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
