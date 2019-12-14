
// Conexão
const db = require('db').asyncConnect()

//MundiPagg
const MundiPagg = require('mundipagg')

module.exports = async (req, res) => {

    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var { idusuario } = req.query

    var token = await db.query(`
         CALL PCD_CANTAI_OBTER_TOKEN(${idusuario});
     `)

    const mp = new MundiPagg('sk_3qLaPMEi0hVPxr0K')

    const result = await mp.cancelarPlano(token[0][0].MUNDIPAGG)

    var res1 = JSON.stringify(result).split('"')
    var res2 = res1[4].split(".")

    if (res2[0] == "Subscription not found") {
        return res.send({
            "success": false,
            "message": "Assinatura não encontrada."
        })
    } else {
        //Colocar data de cancelamento
        var assinaturas = await db.query(`
        CALL PCD_CANTAI_CANCELAR_ASSINATURA(${idusuario});
        `)

        await util(assinaturas[0], async (el, index) => {
            //excluir USUARIO_ASSINATURA_USUARIO - compartilhamentos
            await db.query(`
                CALL PCD_CANTAI_EXCLUIR_ASSINATURA(${el.ID_USUARIO_ASSINATURA_USUARIO});
            `)

            //Remover o premium do usuario
            await db.query(`
                CALL PCD_CANTAI_REMOVER_PREMIUM(${el.CODG_USUARIO});
            `)
        })

        return res.send({
            "success": true,
            "message": "Cancelamento realizado."
        })
    }
}

