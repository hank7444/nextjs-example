const prod = process.env.NODE_ENV === 'production';

module.exports = {
  __DEVELOPMENT__: true,
  __TEST_VAR__: 'hello world!!',
  __IS_STATIC_SERVER_HOST__: true,
  __SERVER_URL__: 'http//:localhost',
  __SDK_PATH__: 'http://localhost',
  __MOCK_API_IS_USE__: true,
  __MOCK_API_HOST__: 'http://localhost',
  __MOCK_API_PORT__: 3100,
};
