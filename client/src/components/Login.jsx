import React from 'react'
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from "react";

const Login = () => {
    const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0()
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {setShowUserLogin,setUser,axios,navigate}=useAppContext()

    const onSubmitHandler = async (event)=>{
           try {
             event.preventDefault();

                const {data} = await axios.post(`/api/user/${state}`,{
                name, email, password});
                if (data.success){
                   navigate('/')
                   setUser(data.user)
                   setShowUserLogin(false)
                }else{
                   toast.error(data.message)

                } 
            }catch (error) {
                  toast.error(error.message)
            }
        }
        useEffect(() => {
           if (isAuthenticated && user) {
              setUser(user) // Auth0 gives { name, email, picture, sub }
              setShowUserLogin(false)
              navigate('/')
    }
  }, [isAuthenticated, user, setUser, setShowUserLogin, navigate])
    


  return (
    // <div onClick={()=>setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center
    //    text-sm text-gray-600 bg-black/50'> 
     
    //   <div
    //   onClick={(e) => e.stopPropagation()}
    //   className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
    //    >
    //   {/* <p className="text-2xl font-medium m-auto">
    //     <span className="text-primary">User</span>{" "}
    //     {state === "login" ? "Login" : "Sign Up"}
    //   </p> */}
      
    //  <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
    //   <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
    //         <p className="text-2xl font-medium m-auto">
    //             <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
    //         </p>
    //         {state === "register" && (
    //             <div className="w-full">
    //                 <p>Name</p>
    //                 <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
    //             </div>
    //         )}
    //         <div className="w-full ">
    //             <p>Email</p>
    //             <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
    //         </div>
    //         <div className="w-full ">
    //             <p>Password</p>
    //             <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
    //         </div>
    //         {state === "register" ? (
    //             <p>
    //                 Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
    //             </p>
    //         ) : (
    //             <p>
    //                 Create an account? <span onClick={() => setState("register")} className="text=primary cursor-pointer">click here</span>
    //             </p>
    //         )}
    //         <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
    //             {state === "register" ? "Create Account" : "Login"}
    //         </button>
    //     </form>
    //     </div>
    //     <div className="flex items-center w-full my-2">
    //     <div className="flex-grow h-px bg-gray-300"></div>
    //     <span className="px-2 text-gray-500 text-sm">or</span>
    //     <div className="flex-grow h-px bg-gray-300"></div>
    //   </div>

    //   {/* ===== OAuth Login ===== */}
    //    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4"></div>
    //   {!isAuthenticated ? (
    //     <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
    //       type="button" // important so it doesn't submit the form
    //       onClick={() => loginWithRedirect()}
          
    //     >
    //       Login with Google
    //     </button>
    //   ) : (
    //     <button
    //       type="button"
    //       onClick={() => logout({ returnTo: window.location.origin })}
    //       className="bg-red-500 hover:bg-red-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
    //     >
    //       Logout
    //     </button>
    //   )}
    //  </div>
    // </div>
    <div
  onClick={(e) => setShowUserLogin(false)}
  className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-black/50"
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="flex flex-col gap-6 w-80 sm:w-[352px] text-gray-500"
  >
    {/* Manual login card */}
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-">
       <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text=primary cursor-pointer">click here</span>
                </p>
            )}
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>

    {/* OR divider */}
    <div className="flex items-center w-full my-2">
      <div className="flex-grow h-px bg-gray-300"></div>
      <span className="px-2 text-gray-500 text-sm">or</span>
      <div className="flex-grow h-px bg-gray-300"></div>
    </div>

    {/* OAuth button card */}
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
      {!isAuthenticated ? (
        <button
          type="button"
          onClick={() => loginWithRedirect({ connection: "google-oauth2" })}
          className="bg-primary hover:bg-primary-dull text-white w-full py-2 rounded-md"
        >
          Login with Google
        </button>
      ) : (
        <button
          type="button"
          onClick={async () => {
      try {
        // 1. If using manual login → clear backend cookie
        await axios.get("/api/user/logout");

        // 2. If using Auth0 → clear Auth0 session
        logout({ returnTo: window.location.origin });

        // 3. Clear frontend state
        setEmail("");
        setPassword("");
        setName("");
      } catch (err) {
        console.error("Logout error:", err);
      }
    }}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md"
        >
          Logout
        </button>
      )}
    </div>
  </div>
</div>

  )
}

export default Login