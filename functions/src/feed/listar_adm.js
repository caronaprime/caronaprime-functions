
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  
  util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
     var topicos_feed = await db.query(`
        CALL PCD_CANTAI_LISTAR_FEEDS_ADM();
        `)
        

    await util(topicos_feed[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)

        var albuns = await db.query(`
           CALL PCD_CANTAI_LISTAR_ALBUNS_TOPICO_FEED(${resultado.ID_TOPICO_FEED})
        `)

        topicos_feed[0][index].albuns = albuns[0]

        console.log("111111111111111111111111111111111111111111111111111")
        console.log(topicos_feed[0])
    })
    return res.send({ "feeds" : topicos_feed[0] });

}
