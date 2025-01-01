const config = {
  express: {
    port: 8000,
  },
  mongo: {
    host: 'mongodb://localhost',
    db: 'miloradowicz-hw-82',
  },
  rootPath: __dirname,
  publicPath: 'public',
};

export default config;
