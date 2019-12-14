
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { nome, cidades, categorias, imagem } = req.body;
    // Validar parâmetros obrigatórios

    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Informe o nome do evento"});
    }
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Escolha a imagem do evento"});
    }
    if (cidades == null || cidades == '' ) {
        return res.send({ "success": false, "message": "Informe a cidade que será realizado o evento"});
    }
    if (categorias == null || categorias == '' ) {
        return res.send({ "success": false, "message": "Escolha pelo menos uma categoria para ser votada no evento"});
    }
    var incluir_evento = await db.query(`
        CALL PCD_CANTAI_INCLUSAO_EVENTO('${nome}', ${cidades}, '${imagem}');
        `)
    await db.query(`
        CALL PCD_CANTAI_INCLUSAO_BANNER_ADM('${imagem}', ${incluir_evento[0][0].ID_EVENTO});
        `)
    console.log(`
        CALL PCD_CANTAI_INCLUSAO_BANNER_ADM('${imagem}', ${incluir_evento[0][0].ID_EVENTO});
        `)
    await util(categorias, async (el, index) => {
        await db.query(`
            CALL PCD_CANTAI_INCLUIR_CATEGORIAS_VOTACAO_EVENTO(${el}, ${incluir_evento[0][0].ID_EVENTO});
            `)
    })

    return res.send({ "success": true });

}