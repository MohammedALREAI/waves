import { model, Schema } from 'mongoose'

import { Payment } from '@/interfaces/Payment.interface'

const paymentSchema: Schema = new Schema({  
  user: {
    type: Array,
    default: []
},
data: {
    type: Array,
    default: []
},
product: {
    type: Array,
    default: []
}
});

const paymentModel = model<Payment>('Payment', paymentSchema);

export default paymentModel;
