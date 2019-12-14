// Conexão
const db = require('db').asyncConnect()

const sms = require('sms')

module.exports = async (req, res) => {
    const {assinatura, nome, telefone} = req.body;

    if(assinatura == null){
        res.send({"success": false, "message": "Informe a assinatura."});
    }
    if(nome == null){
        res.send({"success": false, "message": "Informe o nome."});
    }
    if(telefone == null){
        res.send({"success": false, "message": "Informe o telefone."});
    }

    
    return db.query(`
       CALL PCD_CANTAI_PENDENCIA_ASSINATURA(${assinatura}, '${nome}', '${telefone}');
       `, (error, result) => {
       if (error) throw error;

       sms.send(telefone, `
       Você ganhou um convite PREMIUM, baixe o app: http://bit.ly/2XNa1r9, 
       e siga as instruções a seguir: Menu > gerenciar assinatura > 
       resgatar convite > digite seu numero.
       `)

       res.send({ "success" : "true" });
   });
   
}