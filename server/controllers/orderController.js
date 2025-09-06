import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Stripe from "stripe";
import User from "../models/User.js"


// Place Order STRIPE : /api/order/stripe
export const placeOrderStripe = async (req, res)=>{
   try {
    const origin=req.get('origin')
      const{ userId, auth0Id } = req.user || {};
     const {  items, address } = req.body;
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
              auth0Id,
              items,
              amount,
              address,
              paymentType: "Online",
              isPaid: false,
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
       const session = await stripeInstance.checkout.sessions.create({
          line_items,
          mode: "payment",
          success_url: `${origin}/loader?next=my-orders` ,
          cancel_url:`${origin}/cart` ,
          metadata:{
          orderId: order._id.toString(),
          userId: userId ? userId.toString() : "",
          auth0Id: auth0Id || "",
          }
       })  

       console.log(session.metadata)
       return res.json({success:true,url:session.url})

} 
catch (error) {
   return res.json({success:false,message:error.message});
}
}


// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response)=>{
      // Stripe Gateway Initialize
       const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

       const sig = request.headers["stripe-signature"];
       let event;

       try {
           event = stripeInstance.webhooks.constructEvent(
           request.body,
           sig,
           process.env.STRIPE_WEBHOOK_SECRET);

       } catch (error) {
         console.log("Webhook error:", err.message);
         response.status(400).send( `Webhook Error: ${error.message}` )
       }

       // Handle the event
       switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const { orderId, userId, auth0Id } = session.metadata;

      // Mark order as paid
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { isPaid:true });
      }

      // Clear cart
      if (userId) {
        await User.findByIdAndUpdate(userId, { $set: { cartItems: [] } });
       
      } else if (auth0Id) {
        await User.findOneAndUpdate({ auth0Id }, { $set: { cartItems: [] } });
       
      }
      console.log("Payment successful and cart cleared for user:", userId || auth0Id);
      break;

    case "checkout.session.expired":
      // Optionally delete unpaid orders
      const expiredSession = event.data.object;
      const expiredOrderId = expiredSession.metadata.orderId;
      if (expiredOrderId) {
        await Order.findByIdAndDelete(expiredOrderId);
      }
      break;

    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

   response.json({recieved:true});
}




// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
   try {
     const { items, address } = req.body;
     const{ userId, auth0Id } = req.user || {};
     if (!userId && !auth0Id) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }
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
              auth0Id,
              items,
              amount,
              address,
              paymentType: "COD",
       });
       if (userId) {
      await User.findByIdAndUpdate(userId, { cartItems: [] });
    }
    if (auth0Id) {
      await User.findOneAndUpdate({ auth0Id }, { cartItems: [] });
    }

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
                 $or: [{paymentType: "COD"}, { paymentType: "Online" },{isPaid: true}]
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
                 $or: [{paymentType: "COD"}, { paymentType: "Online" },{isPaid: true}]
            }).populate("items.product address");
            res.json({ success: true, orders });
         } catch (error) {
             res.json({success:false,message:error.message}) 
         }
        }