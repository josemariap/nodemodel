const express = require('express');
const router = express.Router();


router.get('/prueba/post/', (req, res)=>{

    console.log("Entre");
    res.send("Entre");
    

});


module.exports = router;

