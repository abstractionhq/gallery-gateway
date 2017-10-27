const store = do {
  if (process.env.NODE_ENV === 'production') require('./prod').default; // eslint-disable-line
  else require('./dev').default; // eslint-disable-line
};

export default store;
