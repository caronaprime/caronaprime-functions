
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    // Obter parâmetros do POST
    var {
        email, senha
    } = req.body

    // Validar campos
    if (email == null || email == '') {
        return res.send({ "success": false, "message": "Informe o e-mail" })
    }
    
    if (senha == null || senha == '') {
        return res.send({ "success": false, "message": "Informe uma senha" })
    }

    const result = await db.query(` CALL PCD_CANTAI_LOGIN_ADM('${email}', '${senha}')`)

    if (result[0].length > 0) {

        // Retornar dados do usuário
        return res.send({
            success: true,
            message: "Usuário cadastrado com sucesso",
            usuario: result[0]
        })
    }else{
        return res.send({ "success": false, "message": "Dados inválidos ou inexistentes" })
    }
}
