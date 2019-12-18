
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { imagem, data, nome, descricao, categorias } = req.body;
    // Validar parâmetros obrigatórios

    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Selecione uma foto do artista"});
    }
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Informe o nome completo ou 'artístico' do artista"});
    }
    if (data == null || data == '' ) {
        return res.send({ "success": false, "message": "Pesquise a data de nascimento do artista para informar ao Admin Cantai-SH"});
    }
    if (descricao == null || descricao == '' ) {
        return res.send({ "success": false, "message": "Informe a descrição do artista"});
    }
    if (categorias == null || categorias == '' ) {
        return res.send({ "success": false, "message": "Escolha pelo menos uma categoria para o artista"});
    }
    var incluir_artista = await db.query(`
        CALL PCD_CANTAI_INCLUSAO_ARTISTA('${imagem}', '${data}', '${nome}', '${descricao}');
        `)

    await util(categorias, async (el, index) => {
        await db.query(`
            CALL PCD_CANTAI_INCLUIR_CATEGORIAS_ARTISTA(${el}, ${incluir_artista[0][0].ID_ARTISTA});
            `)
    })

    return res.send({ "success": true });

}
