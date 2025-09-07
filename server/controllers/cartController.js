import User from "../models/User.js"

// Update User CartData : /api/cart/update

export const updateCart = async (req, res)=>{
    try {
       if (!req.user || (!req.user.userId && !req.user.auth0Id)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
       const userIdentifier = req.user.userId || req.user.auth0Id;

    // find user either by local id or auth0Id
    const user = await User.findOne({
      $or: [{ _id: userIdentifier }, { auth0Id: userIdentifier }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.cartItems = req.body.cartItems;
    await user.save();

    res.json({ success: true, message: "Cart updated", cartItems: user.cartItems });
  }  catch (error) {
        console.log(error.message)
        res. json({ success: false, message: error.message })

}

}
