import { Document } from 'mongoose'

export interface Site extends Document {
  featured: Array<any>,
  siteInfo: Array<any>,
}
