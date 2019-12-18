
// Conexão
const db = require('db').asyncConnect()
const { PubSub } = require('@google-cloud/pubsub')

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id, nomesMusicas, audios } = req.body;
    // Validar parâmetros obrigatórios
    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "id faltando"});
    }
    if (audios == null || audios == '' ) {
        return res.send({ "success": false, "message": "cadastrar albuns "});
    }

    var artistas_do_album = await db.query(`
        CALL PCD_CANTAI_LISTAR_ARTISTAS_DO_ALBUM_ADM(${id});
        `)
    var categorias_do_album = await db.query(`CALL PCD_CANTAI_LISTAR_CATEGORIAS_DO_ALBUM_ADM(${id})`)
        await util(audios, async (el, index) => {
            console.log("====================")
            console.log("audio: "+el)
            console.log("index: "+index)
            console.log("musica: "+nomesMusicas[index])
            var nova_musica = await db.query(`
                CALL PCD_CANTAI_INCLUSAO_MUSICA(${id}, '${el}', '${nomesMusicas[index]}');
                `)
            console.log(nova_musica[0][0].ID_MUSICA)
            await db.query(`
                CALL PCD_CANTAI_CADASTRAR_MUSICAS_ALBUM(${id}, '${nova_musica[0][0].ID_MUSICA}');
            `)


            
            await util(artistas_do_album[0], async (el, index) => {

                var resultado = JSON.parse(JSON.stringify(el))
                await db.query(`
                    CALL PCD_CANTAI_SOMAR_ARTISTA_MUSICA_ADM(${resultado.ID_ARTISTA});
                    `)
            })




            await util(categorias_do_album[0], async (el, index) => {

                var resultado_categoria = JSON.parse(JSON.stringify(el))
                await db.query(`
                    CALL PCD_CANTAI_CADASTRAR_CATEGORIA_MUSICA_ADM(${resultado_categoria.ID_CATEGORIA}, ${nova_musica[0][0].ID_MUSICA});
                    `)
            })





            const pubsub = new PubSub({projectId: "appmaria-cantaish"})
            const atributos = {
                idalbum: ""+id+"",
                idmusica: ""+nova_musica[0][0].ID_MUSICA+"",
                temporario: ""+el+""
            }
            await pubsub
                .topic('vincular_audio')
                .publish(Buffer.from("A"), atributos)

            console.log("====================")
        })
       return res.send({ "success": true});

}