
module.exports = async (req, res) => {

   // CORS
   res.header("Access-Control-Allow-Origin", "*")
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token")

   res.send({ "success" : true });
}
