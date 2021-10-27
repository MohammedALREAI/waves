// import { dbConfig } from '@interfaces/db.interface'

// import config from 'config'

// const { host, port, database }: dbConfig = config.get('dbConfig');
// `mongodb://${host}:${port}/${database}`
export const dbConnection = {
  url: process.env.DATA_BASE_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
