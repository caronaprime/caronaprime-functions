
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    // Parâmetros do Corpo
    const { nome, descricao, data, categorias, id_artista, imagemArtista } = req.body;    
    var util = []
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (nome == null || nome == '') {
        return res.send({ "success": false, "message": "Coloque o nome do artista"});
    }
    if (descricao == null || descricao == '') {
        return res.send({ "success": false, "message": "Coloque a descricao do artista"});
    }
    if (imagemArtista == null || imagemArtista == '') {
        return res.send({ "success": false, "message": "Coloque uma imagem para alterar"});
    }
    if (data == null || data == '') {
        return res.send({ "success": false, "message": "Coloque a data de nascimento do artista"});
    }
    if (categorias == null || categorias == '') {
        return res.send({ "success": false, "message": "Selecione pelo uma categoria para o artista"});
    }
    if (id_artista == null || id_artista == '') {
        return res.send({ "success": false, "message": "Não encontrou o artista. por favor entre em contato com o suporte"});
    }

    await db.query(`
        CALL PCD_CANTAI_ALTERAR_ARTISTA_ADM('${data}', '${nome}', '${descricao}', ${id_artista}, '${imagemArtista}');
        `)

    await db.query(`
        CALL PCD_CANTAI_EXCLUIR_CATEGORIA_ARTISTA_ADM(${id_artista});
        `)

    await util(categorias, async (el, index) => {
        await db.query(`
        CALL PCD_CANTAI_INCLUIR_CATEGORIAS_ARTISTA(${el}, ${id_artista});
        `)
    })
    return res.send({ "success": true});

}
