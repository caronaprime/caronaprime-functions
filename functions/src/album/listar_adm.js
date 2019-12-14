
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
  
  var util = []
  
  util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }


     var albuns = await db.query(`
        CALL PCD_CANTAI_LISTAR_ALBUNS_ADM();
        `)
        

    await util(albuns[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)

        var artista = await db.query(`
           CALL PCD_URUS_LISTAR_ARTISTAS_ALBUM_ADM(${resultado.ID_ALBUM})
        `)

        albuns[0][index].artista = artista[0]

        console.log("111111111111111111111111111111111111111111111111111")
        console.log(albuns[0])
    })

    await util(albuns[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)

        var categorias = await db.query(`
           CALL PCD_URUS_LISTAR_CATEGORIAS_ALBUM_ADM(${resultado.ID_ALBUM})
        `)

        albuns[0][index].categorias = categorias[0]

        console.log("111111111111111111111111111111111111111111111111111")
        console.log(albuns[0])
    })
    return res.send({ "albuns" : albuns[0] });
}
