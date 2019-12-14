
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    // var individual = 0
    //var familia = 5

   var quantidade = 1000

    for (var i = 0; i < quantidade; i++) {
        let r = Math.random().toString(36).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').substring(1, 10).toUpperCase();
        await db.query(`
            CALL PCD_CANTAI_INCLUIR_CODIGO_ASSINATURA('${r}');
        `)
    }

    res.send({ "success": true })

}
