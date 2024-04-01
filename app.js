const express = require('express');
const bodyParser = require("body-parser");
const homeRoute = require("./routes/amazon");
const app = express()
const PORT = 3000;

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(homeRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

