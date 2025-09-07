import { createContext,useContext,useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
// import { updateCart } from "../../../server/controllers/cartController";

axios.defaults.withCredentials=true;
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

 export const AppContextProvider = ({children})=>{

const currency=import.meta.env.VITE_CURRENCY;


const navigate = useNavigate();
const [user,setUser] = useState(null)
const [isSeller, setIsSeller] = useState(null)
const [showUserLogin, setShowUserLogin] = useState(false)
const [products, setProducts] = useState([])
const [cartItems,setCartItems]=useState({})
const [searchQuery,setSearchQuery]=useState({})
const { getAccessTokenSilently, isAuthenticated,user: auth0User } = useAuth0();
 const [authToken, setAuthToken] = useState(null);

// Helper to get headers for Auth0 users
  const getHeaders = async () => {
    // OAuth user
    if (isAuthenticated ) {
      if(!authToken){
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      return { Authorization: `Auth0 ${token}` };
    }
      return { Authorization: `Auth0 ${authToken}` };
  }

    // 2Local JWT stored in cookies or state
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }

    return {};
  };



// Fetch User Auth Status , User Data and Cart Items
     const fetchUser = async ()=>{
         try {
          
           const {data} = await axios.get('/api/user/is-auth',{headers:getHeaders(),withCredentials:true});
           if (data.success){
             setUser({ ...data.user, token:user?.token })
             setCartItems(data.user.cartItems)
           }
          }

         catch (error) {
               setUser(null)}
         }
        







// Fetch Seller Status
   const fetchSeller = async ()=>{
         try {
           const headers = await getHeaders();
           const {data} = await axios.get('/api/seller/is-auth',{headers,withCredentials:true});
           if(data.success){
              setIsSeller(true)
           }else{
              setIsSeller(false)
           }
          } catch (error) {
              setIsSeller(false)
          }
        }




   // Fetch All Products
     const fetchProducts = async ()=>{
        try {
           const headers = await getHeaders();
           const { data } = await axios.get('/api/product/list',{headers,withCredentials:true})
           if(data.success){
               setProducts(data.products)
           }else{
           toast.error(data.message)
           }
        } 

        catch (error) {
               toast.error(error.message)
        }
      }

//Add product to cart
const addToCart=(itemId)=>{
  if (!user && !isAuthenticated) {
    toast.error("Unauthorized! Please login.");
    return;
  }


  let cartData=structuredClone(cartItems);
  if (cartData[itemId]){
    cartData[itemId]+=1;
  }else{
    cartData[itemId]=1;
  }
  setCartItems(cartData);
  toast.success("Added to Cart") /*in App.jsx under the nav bar need to add toast component*/
  
}
//update cart Item quantity
const updateCartItem=(itemId,quantity)=>{
  if (!user) {
    toast.error("Unauthorized! Please login.");
    return;
  }
  let cartData=structuredClone(cartItems);
  cartData[itemId]=quantity;
  setCartItems(cartData)
  toast.success("cart Updated")
}
//Remove from cart
const removeFromCart = (itemId)=>{
  if (!user) {
    toast.error("Unauthorized! Please login.");
    return;
  }
   let cartData = structuredClone(cartItems);
   if(cartData[itemId]){
      cartData[itemId] -= 1;
       if(cartData[itemId] === 0){
          delete cartData[itemId];
       }

   toast.success("Removed from Cart")
   setCartItems(cartData)
}
}
   // Get Cart Item Count
     const getCartCount = ()=>{
     let totalCount = 0;
     for(const item in cartItems){
       totalCount += cartItems[item];
     }
    return totalCount;

}
// Get Cart Total Amount
    const getCartAmount = () =>{
        let totalAmount = 0;
        for (const items in cartItems) {
          let itemInfo = products. find((product)=> product._id === items);
            if(cartItems[items] > 0){
             totalAmount += itemInfo.offerPrice * cartItems[items]
            }
         }
       return Math.floor(totalAmount * 100) / 100;
    }
    
  useEffect(()=>{
    fetchProducts()
    fetchSeller()
    fetchUser()
  },[])

   useEffect(()=>{
      const updateCart = async ()=>{
        if (!user && !isAuthenticated) return;

    
         try {
           const headers = await getHeaders();
           const { data } = await axios.post('/api/cart/update', {cartItems},{headers,withCredentials:true})
           if (!data.success){
           toast.error(data.message)

           } 
          }catch (error) {
            toast.error(error.message)

           }
      }

        if((user || isAuthenticated) && Object.keys(cartItems).length > 0){
         updateCart()
        }},[cartItems,user,isAuthenticated])
      
   useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        setAuthToken(token);
      }
    };
    fetchToken();
  }, [isAuthenticated]);





  const value = {navigate,user, setUser, setIsSeller, isSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,axios,fetchProducts,setCartItems}

  return <AppContext.Provider value={value}>
       {children}
   </AppContext.Provider>
 }

 
   export const useAppContext = ()=>{
   return useContext(AppContext)
  }



 

