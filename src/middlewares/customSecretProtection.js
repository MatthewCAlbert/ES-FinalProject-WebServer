const customSecretProtection = (req,res,next)=>{
    if( req.body._secret !== process.env.CUSTOM_SECRET ) res.sendStatus(403);
    else next();
}

module.exports = customSecretProtection;