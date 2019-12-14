
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

	const { id } = req.params;
	var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

	var categorias = await db.query(`CALL PCD_CANTAI_LISTAR_CATEGORIA_VOTACAO_EVENTO(${id});`)

    await util(categorias[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)

        var candidatos = await db.query(`
           CALL PCD_CANTAI_LISTAR_HANKING_POR_CATEGORIA(${id}, ${resultado.ID_CATEGORIA_VOTACAO})
        `)

        categorias[0][index].candidatos = candidatos[0]

        console.log("111111111111111111111111111111111111111111111111111")
        console.log(categorias[0])
    })
    return res.send({ "categorias" : categorias[0] });


}
