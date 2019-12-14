
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const { nome, descricao, status, albuns } = req.body;
    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Escolha o nome que irá aparecer no feed"});
    }
    if (descricao == null || descricao == '' ) {
        return res.send({ "success": false, "message": "informe a descrição do feed"});
    }
    if (status == null || status == '' ) {
        return res.send({ "success": false, "message": "Informe o status"});
    }
    if (albuns == null || albuns == '' ) {
        return res.send({ "success": false, "message": "Informe pelo menos uma album"});
    }
    var incluir_feed = await db.query(`
        CALL PCD_CANTAI_INCLUSAO_FEED_ADM('${nome}', '${descricao}', '${status}');
        `)
        await util(albuns, async (el, index) => {
            await db.query(`
                CALL PCD_CANTAI_INCLUIR_ALBUNS_TOPICO_FEED_ADM(${el}, ${incluir_feed[0][0].ID_TOPICO_FEED});
                `)
        })
    return res.send({ "success": true });

}
