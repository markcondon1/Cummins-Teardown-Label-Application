

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())

app.get('/', (req, res)=>{
    res.send('respone tester')

})
app.listen(8080, () => {
  console.log('server listening on port 8080');
});