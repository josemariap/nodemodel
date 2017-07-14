const express = require('express');
const router = express.Router();

const facebookService = require('../service/facebook');

router.post('/group/post/:groupId', (req, res)=>{

    facebookService.postMessage(req.params.groupId, req.body).then(response =>{
    
        res.status(200).json(response);
    })



});


module.exports = router;

