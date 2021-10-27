import { model, Schema } from 'mongoose'

import { Site } from './../interfaces/site.interface'

const siteSchema: Schema = new Schema({
  featured: {
    required: true,
    type: Array,
    default: []
},
siteInfo: {
    required: true,
    type: Array,
    default: []
}});

const siteModel = model<Site>('Site', siteSchema);

export default siteModel;
