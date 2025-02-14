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