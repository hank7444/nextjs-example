const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'BACKEND_URL': prod ? 'https://api.example.com' : 'https://localhost:8080',
  '__TEST_VAR__': 'hello world!!',
};
