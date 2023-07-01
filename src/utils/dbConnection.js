import { connect } from 'mongoose';

export async function connectMongo() {
  try {
    await connect(
      'mongodb+srv://lucasmedrano98lm:Xg6CweZZ7Kaew1lZ@cluster0.q1xgzj4.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'ecommerce' }
    );
    console.log('plug to mongo!');
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
}
