// const express = require('express');
// const path = require('path');
// const prerender = require('prerender-node');
// const app = express();

// // ✅ Set token first, then use the middleware
// prerender.set('prerenderToken', 'GUXLvOxtm2TpnJGXLxC6');
// app.use(prerender);

// // Serve static files from React build
// app.use(express.static(path.join(__dirname, 'build')));

// // Fallback to index.html for React Router
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// // Start server
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
