
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {


    var quantidade = 200

    for (var i = 0; i < quantidade; i++) {
        let r = Math.random().toString(36).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').substring(1, 10).toUpperCase();
        await db.query(`
            CALL PCD_CANTAI_INCLUIR_CODIGO_ASSINATURA2('${r}');
        `)
    }

    res.send({ "success": true })

}
