const config = {
  express: {
    port: 8000,
  },
  mongo: {
    host: 'mongodb://localhost',
    db: 'miloradowicz-hw-82',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  saltWorkFactor: 10,
  rootPath: __dirname,
  publicPath: 'public',
};

export default config;
