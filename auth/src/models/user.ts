import mongoose from 'mongoose';
import { Password } from '../services/password';


interface UserAttr {
  email: string;
  password: string;
}

// an interface that describe
//the properties of the usermodel

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttr): UserDoc;
}

// mongoose returning object is different
// therefore we need to check its type and properties

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
},{
  toJSON:{
    transform(doc,ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.password
      delete ret.__v
    }
  }
});

// hash password before save

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

// build user is used to strictly check
// type checking and properties of object

UserSchema.statics.build = (attrs: UserAttr) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
