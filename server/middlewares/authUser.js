
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const verifyAuth0Token = async (token) => {
  const client = jwksClient({
    jwksUri: process.env.AUTH0_JWKS_URI
  });

  const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return callback(err);
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };

  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER,
      algorithms: ["RS256"]
    }, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};


  const authUser = async (req, res, next)=>{
  try{
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : null;

      if (bearerToken) {
      const decoded = await verifyAuth0Token(bearerToken);
      req.user = { role: "user", auth0Id: decoded.sub, ...decoded };
      return next();
    }

    // 2. Local JWT flow (cookie token)
    const { token } = req.cookies;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id) {
        req.user = { userId: decoded.id };
        return next();
      }
    }

    return res.status(401).json({ success: false, message: "Not Authorized" });
       } 
      
      catch (error) {
         res.json({success:false,message:error.message})
}
  }

export default authUser;