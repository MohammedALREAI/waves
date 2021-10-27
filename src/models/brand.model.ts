import { Document, model, Schema } from 'mongoose'
import { Brand } from '@interfaces/Brands.interface'

const brandSchema: Schema = new Schema({
  name: {
    required: true,
    type: String,
    unique: 1,
    maxlength: 100,
  },
});

const brandModel = model<Brand>('Brand', brandSchema);

export default brandModel;
