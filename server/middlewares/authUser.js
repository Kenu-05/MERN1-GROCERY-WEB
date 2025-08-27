
import jwt from "jsonwebtoken";
  const authUser = async (req, res, next)=>{
  const {token} = req.cookies;




      if(!token){
        return res.json({ success: false, message: 'Not Authorized' });
      }

      try {
        //  console.log("Cookies received:", req.cookies);

         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
         console.log(tokenDecode)
         if(tokenDecode.id){
            //  req.body.userId = tokenDecode.id;
            req.user = { userId: tokenDecode.id };

         }else{
           return res.json({ success: false, message: 'Not Authorized' });
         }
        // exicute the controller
          next();
       } 
      catch (error) {
         res.json({success:false,message:error.message})
}
}
export default authUser;