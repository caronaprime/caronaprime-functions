// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
  const {id} = req.params;
  var util = []
  
  util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }


     var candidatos = await db.query(`
        CALL PCD_CANTAI_LISTAR_CANDIDATOS_EVENTO_ADM(${id});
        `)
        

    await util(candidatos[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)

        var categorias_candidatos = await db.query(`
           CALL PCD_URUS_LISTAR_CATEGORIAS_CANDIDATOS_ADM(${resultado.ID_CANDIDATOS})
        `)

        candidatos[0][index].categorias_candidatos = categorias_candidatos[0]

        console.log("111111111111111111111111111111111111111111111111111")
        console.log(candidatos[0])
    })
    return res.send({ "candidatos" : candidatos[0] });
}
