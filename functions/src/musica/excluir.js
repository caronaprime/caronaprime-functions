
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id, id_album} = req.body;
    // Validar parâmetros obrigatórios
    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Algo de errado aconteceu, Música não encontrada, faça novamente o login"});
    }
    if (id_album == null || id_album == '' ) {
        return res.send({ "success": false, "message": "Algo de errado aconteceu pois o album não foi encontrado, faça novamente o login"});
    }
    var artistas_do_album = await db.query(`
        CALL PCD_CANTAI_LISTAR_ARTISTAS_DO_ALBUM_ADM(${id_album});
        `)
    await util(artistas_do_album[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
        await db.query(`
            CALL PCD_CANTAI_DIMINUIR_ARTISTA_MUSICA_ADM(${resultado.ID_ARTISTA});
            `)
    })
    return await db.query(`
        CALL PCD_CANTAI_EXCLUSAO_MUSICA_ADM(${id}, ${id_album});
        `, (error, result) => {
        if (error) throw error;

        
        res.send({ "success" : true, "message": "Exclusão do audio realizado com sucesso!" });
    });

}
