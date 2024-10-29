// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api', // or whatever route you want to proxy
//     createProxyMiddleware({
//       target: 'https://zelesegna.com',
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api': '/convene/app/get_feed.php',
//       },
//     })
//   );
// };
