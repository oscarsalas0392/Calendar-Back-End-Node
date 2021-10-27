const {response} = require('express');
const {validationResult} = require('express-validator');
const Usuario = require('../model/Usuario');
const { UsuarioSchema, off } = require('../model/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');





const crearUsuario =async(req,res =response)=>{
   
   try
   {   
   const {name,email,password} =  req.body
   
   let usuario = await Usuario.findOne({email:email});
   
   console.log(usuario);
   if(usuario)
   {
      return res.status(400).json({
         ok:false,
         msg:'Un usuario existe con ese correo'
      })
   }

   usuario = new Usuario(req.body);

   const salt=bcrypt.genSaltSync();
   usuario.password= bcrypt.hashSync(password,salt);

   await usuario.save();

   //JWT

   const token = await generarJWT(usuario.uid,usuario.name);

   res.status(201).json({
             ok:true,
             iud:usuario.id,
             name:usuario.name,
             token
    });
   }
   catch(error)
   {
      res.status(500).json({
         ok:false,
         msg:'Por favor hable con el administrador'
      });
   }
 }

 const loginUsuario=async(req,res =response)=>{
  
 
   const {name,email,password} =  req.body
   try
   {
     const usuario= await Usuario.findOne({email});
     
     if(!usuario)
     {
        return res.status(400).json({
           ok:false,
           msg:'Un usuario no existe con ese email'
        })
     }
     

     //Confirma Passwords

     const validPassword = bcrypt.compareSync(password,usuario.password);

     if(!validPassword)
     {
         res.status(400).json({
            ok:false,
            msg:'Password incorrecto'
         });
     }

     const token = await generarJWT(usuario.id,usuario.name);

      res.json({
               ok:true,
               uid:usuario.id,
               name:usuario.name,
               token

      });

   }
   catch(error)
   {
      res.status(500).json({
         ok:false,
         msg:'Por favor hable con el administrador'
      });
   }
 }

 const revalidarToken = async(req,res =response)=>{
    

   const uid=req.uid;
   const name = req.name;

   const token=await generarJWT(uid,name);
 
    res.json({
             ok:true,
             uid,
             name,
             token
    });
 
 }



 module.exports = 
 {
     crearUsuario,
     loginUsuario,
     revalidarToken
};