import jwt from 'jsonwebtoken';


const authSeller = async (req, res, next) =>{
      const { sellerToken } = req.cookies;

      if(!sellerToken) {
         return res. json({ success: false, message: 'Not Authorized' });
      }

      try {
              //  console.log("Cookies received:", req.cookies);
               const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
               
               if(tokenDecode.email===process.env.SELLR_EMAIL){
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