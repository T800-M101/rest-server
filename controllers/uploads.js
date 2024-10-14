const path  = require('path');
const fs  = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);
const { request, response } = require('express');
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');


const loadFile = async (req = request, res = response) => {

  try {
  
    const fileName = await uploadFile(req.files, ['txt', 'md'], 'files');
   
    return res.status(200).json({
      message: 'OK',
      status: 200,
      response: 'File uploaded: ' + fileName
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      response: 'GET: An error occurred while uploading: ' + error,
    });

  }
}

const updateImg = async(req = request, res = response) => {
  
  try {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
      case 'users':
        model = await User.findById( id );
        if(!model) {
          return res.status(400).json({
            message: 'Not found',
            status: 400,
            message: `There is no user with id ${id}`
          });
        }

      break;

      case 'products':
        model = await Product.findById( id );
        if(!model) {
          return res.status(400).json({
            message: 'Not found',
            status: 400,
            message: `There is no product with id ${id}`
          });
        }

        break;

      default:
        return res.status(500).json({
          message: 'Internal Server Error',
          status: 500,
          response: 'POST: An error occurred while updating the image'
        });
    }

    // Clean up previous images
    if(model.img) {
      // Erase the image from server
      const imgPath = path.join(__dirname, '../uploads', collection, model.img);
      if( fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    const fileName = await uploadFile(req.files, undefined, collection);

    model.img = fileName;

    await model.save();
     
    return res.status(200).json({
      message: 'Image updated',
      status: 200,
      model
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      response: 'POST: An error occurred while updating the image'
    });
    
  }
}

const updateImgCloudinary = async(req = request, res = response) => {
  
  try {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
      case 'users':
        model = await User.findById( id );
        if(!model) {
          return res.status(400).json({
            message: 'Not found',
            status: 400,
            message: `There is no user with id ${id}`
          });
        }

      break;

      case 'products':
        model = await Product.findById( id );
        if(!model) {
          return res.status(400).json({
            message: 'Not found',
            status: 400,
            message: `There is no product with id ${id}`
          });
        }

        break;

      default:
        return res.status(500).json({
          message: 'Internal Server Error',
          status: 500,
          response: 'POST: An error occurred while updating the image'
        });
    }

    // Clean up previous images
    if(model.img) {
      // Erase the image from server
      const nameArr = model.img.split('/');
      const name = nameArr[nameArr.length -1];
      const [ publicId ] = name.split('.');  
      cloudinary.uploader.destroy(publicId);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;
    await model.save();
     
    return res.status(200).json({
     message: 'Image uploaded',
     status: 200,
     model
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      response: 'POST: An error occurred while updating the image'
    });
    
  }
}

const getImage = async (req = request, res = response) => {
  try {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
      case 'users':
        model = await User.findById( id );
        if(!model) {
          return res.status(400).json({
            message: 'Not found',
            status: 400,
            message: `There is no user with id ${id}`
          });
        }

      break;

      case 'products':
        model = await Product.findById( id );
        if(!model) {
          return res.status(400).json({
            message: 'Not found',
            status: 400,
            message: `There is no product with id ${id}`
          });
        }

        break;

      default:
        return res.status(500).json({
          message: 'Internal Server Error',
          status: 500,
          response: 'POST: An error occurred while updating the image'
        });
    }
    let imgPath = '';
    // Clean up previous images
    if(model.img) {
      // Erase the image from server
      imgPath = path.join(__dirname, '../uploads', collection, model.img);
      if( fs.existsSync(imgPath)) {
        return res.sendFile(imgPath);
      }
    }

    imgPath = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(imgPath);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 500,
      response: 'POST: An error occurred while updating the image'
    });
    
  }
} 



module.exports = {
  loadFile,
  updateImg,
  getImage,
  updateImgCloudinary
}