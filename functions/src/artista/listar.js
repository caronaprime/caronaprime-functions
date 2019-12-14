// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
  
  var util = []
  
  util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }


     var artistas = await db.query(`
        CALL PCD_CANTAI_LISTAR_ARTISTAS_ADM();
        `)
        

    await util(artistas[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)

        var categorias_artista = await db.query(`
           CALL PCD_URUS_LISTAR_CATEGORIAS_ARTISTA_ADM(${resultado.ID_ARTISTA})
        `)

        artistas[0][index].categorias_artista = categorias_artista[0]

        console.log("111111111111111111111111111111111111111111111111111")
        console.log(artistas[0])
    })
    return res.send({ "artistas" : artistas[0] });
}
