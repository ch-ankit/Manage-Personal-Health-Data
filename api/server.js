const app = require('./index.js');


PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`server started at localhost:${PORT}`);
});

