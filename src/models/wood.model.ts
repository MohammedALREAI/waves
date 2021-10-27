import { Document, model, Schema } from 'mongoose'

import { Wood } from '@/interfaces/Wood.interface'

const woodSchema: Schema = new Schema({
  name: {
    required: true,
    type: String,
    unique: 1,
    maxlength: 100,
  },
});

const woodModel = model<Wood>('Wood', woodSchema);

export default woodModel;
