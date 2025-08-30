import { createContext,useContext,useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { toast } from 'react-hot-toast';
import axios from "axios";

axios.defaults.withCredentials=true;
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

 export const AppContextProvider = ({children})=>{

const currency=import.meta.env.VITE_CURRENCY;

const navigate = useNavigate();
const [user, setUser] = useState(true)
const [isSeller, setIsSeller] = useState(null)
const [showUserLogin, setShowUserLogin] = useState(false)
const [products, setProducts] = useState([])
const [cartItems,setCartItems]=useState({})
const [searchQuery,setSearchQuery]=useState({})

// Fetch Seller Status
   const fetchSeller = async ()=>{
         try {
           const {data} = await axios.get('/api/seller/is-auth');
           if(data.success){
              setIsSeller(true)
           }else{
              setIsSeller(false)
           }
          } catch (error) {
              setIsSeller(false)
          }
        }




//fetch all products
const fetchProducts=async ()=>{
  setProducts(dummyProducts)
}

//Add product to cart
const addToCart=(itemId)=>{
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
  let cartData=structuredClone(cartItems);
  cartData[itemId]=quantity;
  setCartItems(cartData)
  toast.success("cart Updated")
}
//Remove from cart
const removeFromCart = (itemId)=>{
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
  },[])

  const value = {navigate, user, setUser, setIsSeller, isSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,axios}

  return <AppContext.Provider value={value}>
       {children}
   </AppContext.Provider>
}

export const useAppContext = ()=>{
return useContext(AppContext)

}
// bottom of fileல சேர்க்க
export default AppContext;
