module.exports = function(req,res,next){
  if(!process.env.BASE_PATH){
    console.log('### process.env.BASE_PATH does not exists. resolving hostname automatically');
    process.env = process.env || {};

    process.env.BASE_PATH = (req.secure ? 'https://' : 'http://') + req.headers.host;
  }
  next();
}
