
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {codigo} = req.body;

     if(codigo == null){
         res.send({"success": false, "message": "Informe o código."});
     } 

      console.log(codigo)
      var verificado = await db.query(`
        CALL PCD_CANTAI_VERIFICAR_CODIGO_ASSINATURA('${codigo}');
     `)

      if (verificado[0][0].RETORNO == 1) {
        var mes = await db.query(`
          CALL PCD_CANTAI_RESGATAR_CODIGO('${codigo}');
       `)
       
        if (verificado[0][0].PARTICIPANTES == 1){
           var ULTIMO_ID = await db.query(`
             CALL PCD_CANTAI_USUARIO_ASSINAR(${req.jwt.id}, 15, ${mes[0][0].QUANTIDADE_MES});
           `)
           
           await db.query(`
           CALL PCD_CANTAI_USUARIO_ASSINATURA_USUARIO(${req.jwt.id}, '${ULTIMO_ID[0][0].ULTIMO_ID}');
         `)
        } else {
           var ULTIMO_ID = await db.query(`
             CALL PCD_CANTAI_USUARIO_ASSINAR(${req.jwt.id}, 16, ${mes[0][0].QUANTIDADE_MES});
           `)
           
           await db.query(`
          CALL PCD_CANTAI_USUARIO_ASSINATURA_USUARIO(${req.jwt.id}, '${ULTIMO_ID[0][0].ULTIMO_ID}');
       `)}
          
        res.send({ "success" : true });

      } else {
        res.send({ "success" : false, "message": "Código inválido ou já resgatado." });
      }
}
