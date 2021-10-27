const {response} = require('express');
const {validationResult} = require('express-validator');
const Usuario = require('../model/Usuario');
const { UsuarioSchema } = require('../model/Usuario');
const bcrypt = require('bcryptjs');



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

   res.status(201).json({
             ok:true,
             iud:usuario.id,
             name:usuario.name
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

 const loginUsuario=(req,res =response)=>{
   
    const errors= validationResult(req);
    const {name,email,password} =  req.body
 
   if(!errors.isEmpty())
   {
      return res.status(400).json({
         ok:false,
          errors:errors.mapped()
      });
   }

    res.json({
             ok:true,
             msg:'login',
             email,password
    });
 }

 const revalidarToken = (req,res =response)=>{
    console.log('prueba');
 
    res.json({
             ok:true,
             msg:'renew'
    });
 
 }



 module.exports = 
 {
     crearUsuario,
     loginUsuario,
     revalidarToken
};