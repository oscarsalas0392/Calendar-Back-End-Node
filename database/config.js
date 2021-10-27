const mongoose = require('mongoose');


const dbConnetion = async()=>{

    try{    
       await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');
    }
    catch(error)
    {
        console.log(error);
        throw new Error('Error a la hora de inicilizar BD');
    }

}


module.exports ={
    dbConnetion
}