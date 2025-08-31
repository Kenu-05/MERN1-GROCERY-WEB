import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Stripe from "stripe";


// Place Order STRIPE : /api/order/stripe
export const placeOrderStripe = async (req, res)=>{
   try {
    const origin=req.get('origin')
     const { userId, items, address } = req.body;
     if(!address || items.length === 0){
         return res. json({success: false, message: "Invalid data"})
       }
       let productData=[];
// Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item)=>{
       const product = await Product.findById(item.product);
       productData.push({
           name: product.name,
           price: product.offerPrice,
           quantity: item.quantity,});
       return (await acc) + product.offerPrice * item.quantity;
}, 0)
// Add Tax Charge (2%)
       amount += Math.floor(amount * 0.02);

       const order=await Order.create({
              userId,
              items,
              amount,
              address,
              paymentType: "Online",
       });

       // Stripe Gateway Initialize
       const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

       // create line items for stripe

       const line_items = productData.map((item)=>{
         return {
            price_data: {
             currency: "usd",
             product_data:{
                name: item.name,
             },   
             unit_amount: Math.floor(item.price * 1.02 * 100) 
            },
             quantity: item.quantity,
          }
    })

     // create session
       const session = await stripeInstance. checkout.sessions.create({
          line_items,
          mode: "payment",
          success_url: `${origin}/loader?next=my-orders` ,
          cancel_url:`${origin}/cart` ,
          metadata:{
          orderId: order ._id.toString(),
          userId,
          }
       })  


       return res.json({success:true,url:session.url})

} 
catch (error) {
   return res.json({success:false,message:error.message});
}
}




// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
   try {
     const { userId, items, address } = req.body;
     if(!address || items.length === 0){
         return res. json({success: false, message: "Invalid data"})
       }
// Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item)=>{
       const product = await Product.findById(item.product);
       return (await acc) + product.offerPrice * item.quantity;
}, 0)
// Add Tax Charge (2%)
       amount += Math.floor(amount * 0.02);

       await Order.create({
              userId,
              items,
              amount,
              address,
              paymentType: "COD",
       });

       return res.json({success:true,message:"Order Placed Successfullly"})

} 
catch (error) {
   return res.json({success:false,message:error.message});
}
}

     // Get Orders by User ID : /api/order/user
     export const getUserOrders = async (req, res)=>{
         try {
         const userId = req.user.userId;
          const orders = await Order.find({
                 userId,
                 $or: [{paymentType: "COD"}, {isPaid: true}]
            }).populate("items.product address").sort({createdAt: -1});
            res.json({ success: true, orders });
         } catch (error) {
             res.json({success:false,message:error.message}) 
         }
        }

        // Get All Orders(for seller/admin) : /api/order/seller
     export const getAllOrders = async (req, res)=>{
         try {          
          const orders = await Order.find({
                 $or: [{paymentType: "COD"}, {isPaid: true}]
            }).populate("items.product address");
            res.json({ success: true, orders });
         } catch (error) {
             res.json({success:false,message:error.message}) 
         }
        }