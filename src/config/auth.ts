export default {
  jwt: {
    secrets: {
      appSecret: process.env.APP_NORMAL_SECRET || 'default_normal',
    },
    expiresIn: '1d',
  },
};
