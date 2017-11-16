module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_URL || 'postmates',
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: process.env.DATABASE_URL_TEST,
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL
  }

};
