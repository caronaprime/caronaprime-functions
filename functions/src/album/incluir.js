
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { imagem, nome, descricao, categorias, artistas } = req.body;
    // Validar parâmetros obrigatórios
    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Selecione uma foto para o album"});
    }
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Informe o nome completo do album"});
    }
    if (descricao == null || descricao == '' ) {
        return res.send({ "success": false, "message": "Informe uma descrição para o album"});
    }
    if (categorias == null || categorias == '' ) {
        return res.send({ "success": false, "message": "Escolha pelo menos uma categoria para o album"});
    }
    if (artistas == null || artistas == '' ) {
        return res.send({ "success": false, "message": "Escolha pelo menos um artista."});
    }
    var incluir_album = await db.query(`
        CALL PCD_CANTAI_INCLUSAO_ALBUM('${imagem}', '${nome}', '${descricao}');
        `)
    // console.log("inclusao de album concluida ou não")
    // console.log("==================================")
    // console.log(incluir_album[0][0].length)
    // console.log("==================================")
    // console.log(`CALL PCD_CANTAI_INCLUSAO_ALBUM('${imagem}', '${nome}', '${descricao}');`)
    if (incluir_album[0][0].length == 0) {
        return res.send({ "success": false, "message": "Erro ao cadastrar o albúm"});
    }else{
        await util(categorias, async (el, index) => {
            await db.query(`
                CALL PCD_CANTAI_INCLUIR_CATEGORIAS_ALBUM(${el}, ${incluir_album[0][0].ID_ALBUM});
                `)
        })
        await util(artistas, async (el, index) => {
            await db.query(`
                CALL PCD_CANTAI_INCLUIR_ARTISTAS_ALBUM(${el}, ${incluir_album[0][0].ID_ALBUM});
                `)
        })
        
        return res.send({ "success": true, "message": "cadastro feito com sucesso"});
    }

}
