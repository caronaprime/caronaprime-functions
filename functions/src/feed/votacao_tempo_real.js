
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  
  util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
     var evento_para_acompanhamento = await db.query(`
        CALL PCD_CAPTURAR_EVENTO_SELECIONADO_VOTACAO();
        `)

     var categorias = await db.query(`
        CALL PCD_CANTAI_LISTAR_CATEGORIAS_EVENTO_TEMPO_REAL(${evento_para_acompanhamento[0][0].CODG_EVENTO});
        `)
     await util(categorias[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

        
        var candidatos = await db.query(`
           CALL PCD_CANTAI_LISTAR_CANDIDATOS_POR_CATEGORIA_TEMPO_REAL_ADM(${resultado.ID_CATEGORIA_VOTACAO}, ${evento_para_acompanhamento[0][0].CODG_EVENTO})
        `)

        categorias[0][index].candidatos = candidatos[0]

    })
     return res.send({ "categorias" : categorias[0], "nome_evento" : evento_para_acompanhamento[0][0].NOME_EVENTO });
}
