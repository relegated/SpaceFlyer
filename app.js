const express = require('express'),
    app = express();
app.use(express.static("2.0"));
app.listen(8000, "localhost");