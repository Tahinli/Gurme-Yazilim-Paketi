//SERVER

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//buralarda api kısmı olacak

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});