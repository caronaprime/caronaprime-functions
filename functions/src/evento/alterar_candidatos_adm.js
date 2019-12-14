
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id, nome, descricao, imagemFoto, imagemFotoPerfil, link_video } = req.body;    
    var util = []
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (id == null || id == '') {
        return res.send({ "success": false, "message": "candidato não encontrado"});
    }
    if (nome == null || nome == '') {
        return res.send({ "success": false, "message": "Coloque o nome do candidato"});
    }
    if (descricao == null || descricao == '') {
        return res.send({ "success": false, "message": "Coloque uma descrição para o candidato"});
    }
    if (imagemFoto == null || imagemFoto == '') {
        return res.send({ "success": false, "message": "Escolher uma imagem para capa. não pode salvar sem imagem"});
    }
    if (imagemFotoPerfil == null || imagemFotoPerfil == '') {
        return res.send({ "success": false, "message": "Escolher uma imagem para foto de perfil. não pode salvar sem imagem"});
    }
    await db.query(`
        CALL PCD_CANTAI_ALTERAR_CANDIDATO_ADM(${id}, '${nome}', '${descricao}', '${imagemFoto}', '${imagemFotoPerfil}', '${link_video}');
        `)

    return res.send({ "success": true});

}
