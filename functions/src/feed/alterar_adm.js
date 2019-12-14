
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    // Parâmetros do Corpo
    const { titulo, subtitulo, albuns, id_topico_feed } = req.body;    
    var util = []
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (titulo == null || titulo == '') {
        return res.send({ "success": false, "message": "Coloque o título do feed"});
    }
    if (subtitulo == null || subtitulo == '') {
        return res.send({ "success": false, "message": "Coloque a subtitulo do feed"});
    }
    if (albuns == null || albuns == '') {
        return res.send({ "success": false, "message": "Selecione pelo menos um album para colocar neste feed no aplicativo"});
    }
    if (id_topico_feed == null || id_topico_feed == '') {
        return res.send({ "success": false, "message": "Não encontrou o feed. por favor entre em contato com o suporte"});
    }

    await db.query(`
        CALL PCD_CANTAI_ALTERAR_FEED_ADM('${titulo}', '${subtitulo}', ${id_topico_feed});
        `)

    await db.query(`
        CALL PCD_CANTAI_EXCLUIR_ALBUNS_TOPICO_FEED_ADM(${id_topico_feed});
        `)

    await util(albuns, async (el, index) => {
        await db.query(`
        CALL PCD_CANTAI_INCLUIR_ALBUNS_TOPICO_FEED_ADM(${el}, ${id_topico_feed});
        `)
    })
    return res.send({ "success": true});

}
