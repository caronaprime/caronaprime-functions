
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    var obj = {
       items: []
    };
    
    var res1 = await db.query(`CALL PCD_CANTAI_LISTAR_PENDENCIA_ASSINATURA(${req.jwt.id});`)
    var res2 = await db.query(`CALL PCD_CANTAI_LISTAR_PREMIUNS_COMPARTILHADOS(${req.jwt.id});`)

    if (res1[0].length > 0) {
       await util(res1[0], async (el, index) => {
           obj.items.push(el)
       })
    }

    if (res2[0].length > 0) {
       await util(res2[0], async (el, index) => {
           obj.items.push(el)
       })
    }

    //await util(obj.items, async (el, index) => {

       // var resultado = JSON.parse(JSON.stringify(el))

       // var premiuns = await db.query(`CALL PCD_CANTAI_PREMIUNS_PLAYLIST(${el.ID_PLAYLIST});`)

        //obj.items[index].PREMIUNS = premiuns[0]

    //})

    return res.send(obj);

}