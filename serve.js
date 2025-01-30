import mongoose from 'mongoose';
const mongoURI = 'mongodb://root:example@localhost:27017/nueva_bd?authSource=admin';


async function connect() {
    const connection = await mongoose.connect(mongoURI);
    /*const id =crypto.randomUUID()
    await login.create({id: id, name: 'pedrohurt@gmail.com'});
    const doc = await login.findById(id,
        { id: 1, name: 1, _id: 0 }
    )*/
    await connection.disconnect();    
}
connect();
