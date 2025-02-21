import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({_id:{$in:req.user.cartItems}}); 
    // we are only storing productIds of other products in user model
    // we are fetching the products using the productid from the cartitemsin Product model 

    // add quantity for each products
    const cartItems = products.map(product => {
      const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
      return {...product.toJSON(), quantity: item.quantity}
    })

    res.json(cartItems)
  } catch (error) {
    console.log("Error in getCartProducts Controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body; // fetch ptoduct Id 
    const user = req.user; // fetch user

    const existingItem = user.cartItems.find(item => item.id === productId); // find the same product if it already exists in cart

    if (existingItem) { // if the item is already in the cart increase the quantity
      existingItem.quantity += 1;
    } else { // if the item is not already in the cart push the item in the cart
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);

  } catch (error) {
    console.log("Error in addToCart Controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });

  }
}; 


export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId ) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(item => item.id!== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message});
  }
}

export const updateQuantity = async (req, res) => {
  try {
    const {id: productId} = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if(quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id!== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity Controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

