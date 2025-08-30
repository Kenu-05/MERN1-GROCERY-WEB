import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";




const authSeller = async (req, res, next) =>{
      const { sellerToken } = req.cookies;

      if(!sellerToken) {
         return res. json({ success: false, message: 'Not Authorized' });
      }

      try {
               console.log("Cookies received:", req.cookies);
               const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
               
               if(tokenDecode.email===process.env.SELLER_EMAIL){
                   next();
      
               }else{
                 return res.json({ success: false, message: 'Not Authorized' });
               }
              // exicute the controller
               
             } 
            catch (error) {
               res.json({success:false,message:error.message})
      }


    }
    export default authSeller;