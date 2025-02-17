import mongoose from 'mongoose';
const mongoURI = 'mongodb://root:example@localhost:27017/nueva_bd?authSource=admin';


async function connect() {
    try{
        const connection = await mongoose.connect(mongoURI);
        //ejecutas la funcion
    }
    catch(ex){

    }
    finally{
        await connection.disconnect();        
    }
    
    /*const id =crypto.randomUUID()
    await login.create({id: id, name: 'pedrohurt@gmail.com'});
    const doc = await login.findById(id,
        { id: 1, name: 1, _id: 0 }
    )*/
    await connection.disconnect();    
}
connect();
