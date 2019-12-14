
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {telefone} = req.body;

     if(telefone == null){
         res.send({"success": false, "message": "Informe o telefone."});
     }

      var verificado = await db.query(`
        CALL PCD_CANTAI_VERIFICAR_ASSINATURA_PENDENTE('${telefone}');
     `)

      console.log(verificado)
      console.log(verificado[0].lenght)
      
      if (verificado[0][0].RETORNO == 1) {
        await db.query(`
          CALL PCD_CANTAI_RESGATAR_ASSINATURA_PENDENTE('${telefone}');
       `)
        await db.query(`
          CALL PCD_CANTAI_USUARIO_ASSINATURA_USUARIO(${req.jwt.id}, '${verificado[0][0].CODG_USUARIO_ASSINATURA}');
       `)  
        res.send({ "success" : true });

      } else {
        res.send({ "success" : false, "message": "Nenhum resgate pendente para esse telefone." });
      }      
}
