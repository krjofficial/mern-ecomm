import Product from "../models/product.model.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // get all products
    res.json({products});
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message});
  }
}

export const getFeaturedProducts = async(req, res) => {
  try {
    // get all products from redis
    let featuredProducts = await redis.get("featured_products");
    if(featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if featured products not in redis, get them from the database
    featuredProducts = await Product.find({ isFeatured: true }).lean(); // instead of returning mongodb documents/objects, it return plain javascript objects which leads to faster performance

    if(!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick Access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);


  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message}); 
  }
}

async function updateFeaturedProductsCache() {
  try {
    // the lean method is used to return plain javascript objects instead of full mongodb documents
    // this can significantly improve performance
    const featuredProducts = await Product.find({isFeatured: true}).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in updating featuredProductsCache function", error.message);
  }
}
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id);
    if (product) {
      product.isFeatured =!product.isFeatured;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const createProduct = async (req, res) => {
  try {
    const {name, description, price, image, category} = req.body;

    let cloudinaryResponse = null 

    if(image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"})
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse? cloudinaryResponse.secure_url : "",
      category,
    })

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message}); 
  }
}

export const deleteProduct = async (req, res) => {
  // delete the product not only from db but also the image from cloudinary
  try {
    const product = await Product.findById(req.params.id);

    if(!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if(product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // fetches the public id from the cloudinary url stored in mongodb
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Deleted image from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);


  } catch (error) {
    console.log("Error in deleteProduct controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message});
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: {size: 3}
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        }
      }
    ])

    res.json(products)
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({message: "Server Error", error: error.message});
  }
}

export const getProductsByCategory = async (req, res) => {

  const {category} = req.params;

  try {
    const products = await Product.find({category});
    res.json(products);    
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({message: "Server Error", error: error.message});
  }
}



