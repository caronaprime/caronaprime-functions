
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {pagina, pagina_cat} = req.query;

    if(pagina == null){
        pagina =0;
    }
    if(pagina_cat == null){
        pagina_cat =0;
    }
  util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var categorias = await db.query(`CALL PCD_CANTAI_LISTAR_CATEGORIAS(${pagina_cat});`)

    await util(categorias[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
//        console.log(resultado)
//        console.log(resultado.ID_ASSINATURA)

        var musicas = await db.query(`
           CALL PCD_CANTAI_LISTAR_MUSICAS_POR_CATEGORIA(${pagina}, ${resultado.ID_CATEGORIA})
        `)

        categorias[0][index].musicas = musicas[0]

        console.log("111111111111111111111111111111111111111111111111111")
        console.log(categorias[0])
    })

	return res.send({ "categorias" : categorias[0] });

    //  return db.query(`
    //     CALL PCD_URUS_LISTAR_USUARIOS_ADM();
    //     `, (error, result) => {
    //     if (error) throw error;

    //     res.send({ "items" : result[0] });
    // });

}
