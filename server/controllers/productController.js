


import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product"

// Add Product : /api/product/add
    export const addProduct = async (req, res)=>{
      try {
         let productData = JSON.parse(req.body. productData)

         const images = req. files

         let imagesUrl = await Promise.all(
         images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type: 'image'});
                return result.secure_url
            })
        )
        await Product.create({...productData,Image:imagesUrl})
        res.json({success:true,message:"error.message"})

      }catch(error){
          console.log(error.message);
          res.json({success:false,message:error.message})


      }

    }

//Get Product:/api/product/get
export const getProduct=async(req,res)=>{

}
//get single Product:/api/product/id
export const productById=async(req,res)=>{

}
//Change Product inStock:/api/product/stock
export const changeStock=async(req,res)=>{

}
