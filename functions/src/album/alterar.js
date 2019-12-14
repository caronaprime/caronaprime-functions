
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { nome, descricao, categorias, artistas, id_album, imagem } = req.body;    
    var util = []
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    console.log(artistas)
    if (nome == null || nome == '') {
        return res.send({ "success": false, "message": "Coloque o nome do album"});
    }
    if (imagem == null || imagem == '') {
        return res.send({ "success": false, "message": "Necessário inserir uma imagem para alteração"});
    }
    if (descricao == null || descricao == '') {
        return res.send({ "success": false, "message": "Coloque a descricao do album"});
    }
    if (categorias == null) {
        return res.send({ "success": false, "message": "Selecione pelo uma categoria para o album"});
    }
    if (artistas == null) {
        return res.send({ "success": false, "message": "Selecione pelo um artista para o album"});
    }
    if (id_album == null || id_album == '') {
        return res.send({ "success": false, "message": "Não encontrou o album. por favor entre em contato com o suporte"});
    }

    await db.query(`
        CALL PCD_CANTAI_ALTERAR_ALBUM_ADM2('${nome}', '${descricao}', ${id_album}, '${imagem}');
        `)

    await db.query(`
        CALL PCD_CANTAI_EXCLUIR_CATEGORIA_ALBUM_ADM(${id_album});
        `)

    await util(categorias, async (el, index) => {
        await db.query(`
        CALL PCD_CANTAI_INCLUIR_CATEGORIAS_ALBUM(${el}, ${id_album});
        `)
    })
    var artistas_do_album = await db.query(`
        CALL PCD_CANTAI_LISTAR_ARTISTAS_DO_ALBUM_ADM(${id_album});
        `)
    var total_musicas_album = await db.query(`
        CALL PCD_CANTAI_QTDE_MUSICAS_ALBUM_ADM(${id_album});
        `)
    console.log("total de músicas do album: "+total_musicas_album[0][0].NUMR_MUSICAS)
    await util(artistas_do_album[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)
        await db.query(`
            CALL PCD_CANTAI_DIMINUIR_NUMR_ARTISTA_ALBUM_ADM(${resultado.ID_ARTISTA}, ${total_musicas_album[0][0].NUMR_MUSICAS});
            `)
    })
    await db.query(`
        CALL PCD_CANTAI_EXCLUIR_ARTISTA_ALBUM_ADM(${id_album});
        `)

    await util(artistas, async (el, index) => {
        await db.query(`
        CALL PCD_CANTAI_INCLUIR_ARTISTAS_ALBUM_ALTERAR(${el}, ${id_album}, ${total_musicas_album[0][0].NUMR_MUSICAS});
        `)
    })
    return res.send({ "success": true});

}
