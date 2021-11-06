const {response} = require('express');
const Evento = require('../model/Evento')

const getEventos = async(req,res =response)=>{

    const eventos = await Evento.find()
                    .populate('user','name');

    res.json({
        ok:true,
        eventos
    })
}

const crearEvento= async (req,res =response)=>{

    const evento = new Evento(req.body);
    try{
        evento.user = req.uid;

        const eventoGuardado =await evento.save();
        res.json({
            ok:true,
            evento:eventoGuardado
        })
    }catch(error)
    {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }   
}

const actualizarEvento = async(req,res =response)=>{

    const eventoId = req.params.id;
    const uid = req.uid;

    try{
  
        const evento = await Evento.findById(eventoId);
    
        if(!evento)
        {
            res.status(404).json({
                ok:false,
                msg:'Evento no existe por ese id'
            })
        }


        if(evento.user.toString() !==uid)
        {
            res.status(401).json({
                ok:false,
                msg:'No tiene privilegio de editar este evento'
            }) 
        }
   
        const nuevoEvento = {
            ...req.body,
            user:uid
        }
    
        const eventActualizado = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true});

        res.json({
            ok:true,
            evento:eventActualizado
        })  
    }
    catch(error)
    {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }   

    
  
}

const eliminarEvento =async(req,res =response)=>{

    const eventoId = req.params.id;
    const uid = req.uid;
    
    try{
  
        const evento = await Evento.findById(eventoId);
    
        if(!evento)
        {
            res.status(404).json({
                ok:false,
                msg:'Evento no existe por ese id'
            })
        }


        if(evento.user.toString() !==uid)
        {
            res.status(401).json({
                ok:false,
                msg:'No tiene privilegio de editar este evento'
            }) 
        }
   

    
        const eventEliminado = await Evento.findByIdAndDelete(eventoId,{new:true});

        res.json({
            ok:true,
            evento:eventEliminado
        })  
    }
    catch(error)
    {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }   


}


module.exports=
{
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}