
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id} = req.body;
    // Validar parâmetros obrigatórios
    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Algo de errado aconteceu, faça novamente o login"});
    }
    var musicas_album = await db.query(`
        CALL PCD_CANTAI_LISTAR_MUSICAS_DO_ALBUM_ADM(${id});
        `)

    await util(musicas_album[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

       await db.query(`
           CALL PCD_CANTAI_EXCLUIR_MUSICAS_DO_ALBUM(${resultado.ID_MUSICA})
        `)
    })
    var artistas_do_album = await db.query(`
        CALL PCD_CANTAI_LISTAR_ARTISTAS_DO_ALBUM_ADM(${id});
        `)
    var total_musicas_album = await db.query(`
        CALL PCD_CANTAI_QTDE_MUSICAS_ALBUM_ADM(${id});
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
    return await db.query(`
        CALL PCD_CANTAI_EXCLUSAO_ALBUM_ADM(${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "success" : true, "message": "Exclusão de album realizada com sucesso!" });
    });

}
