const jwt = require('jwt')

// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    // CORS
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token")

    // Obter parâmetros do POST
    var {
        nome,
        sobrenome,
        email,
        imagem,
        token_autenticacao,
        token_notificacao,
        id_dispositivo,
        sistema_operacional,
        modelo,
        marca,
        versao,
        sdk_build,
        idioma_dispositivo
    } = req.body

    // Validar campos
    if (token_autenticacao == null || token_autenticacao.length == 0) {
        return res.send({ "success": false, "message": "Informe o Token de Autenticação" })
    }

    // Testar se o usuário já existe
    const rs = await db.query(`
        CALL PCD_CANTAI_LOGIN_UID_APP('${email}')
    `)

    const temp = await db.query(`
        CALL PCD_CANTAI_LOGIN_UID_ID_APP('${email}')
    `)

    // Se o usuário já existir, retornar dados do usuário
    if (temp[0].length > 0) {

        var usuario = rs[0][0]

        //Atualizar token de notificação
        if (token_notificacao != null && token_notificacao.length > 0) {
            await db.query(`
            CALL PCD_CANTAI_ALTERACAO_USUARIOS_TOKEN_NOTIFICACAO_APP_V2(${temp[0][0].ID_USUARIO}, '${token_notificacao}', '${id_dispositivo}')
         `);
        }

        await db.query(`
            CALL PCD_CANTAI_INCLUIR_DADOS_DISPOSITIVO(${temp[0][0].ID_USUARIO}, 
            '${id_dispositivo}', 
            '${sistema_operacional}', 
            '${versao}', '${sdk_build}', '${modelo}', '${marca}', '${idioma_dispositivo}') `)

        var dados = jwt.sign({ id: temp[0][0].ID_USUARIO, nome: temp[0][0].NOME })

        // Retornar dados do usuário
        return res.send({
            success: true,
            message: "OK",
            token: dados,
            bundle: {
                usuario: usuario
            }
        })
    }

    // Se não tiver, irá cadastrar e retornar os dados
    if (nome == null || nome.length == 0) {
        return res.send({ "success": false, "message": "Informe o nome do usuário" })
    }
    if (sobrenome == null || sobrenome.length == 0) {
        return res.send({ "success": false, "message": "Informe o sobrenome do usuário" })
    }
    if (email == null || email.length == 0) {
        return res.send({ "success": false, "message": "Informe o email do usuário" })
    }

    // Inserir Usuário
    return db.query(`
          CALL PCD_CANTAI_INCLUSAO_USUARIO_APP_V2('${nome}', '${sobrenome}', '${email}','', '${imagem}', '${token_autenticacao}', '${token_notificacao}', '${id_dispositivo}')
       `, async (err, result, field) => {
            if (err) throw err

            // Ler usuário cadastrado pelo ID
            const rs_usuario = await db.query(`
           CALL PCD_CANTAI_LOGIN_ID_APP(?)
          `, [result[0][0].ULTIMO_ID])
            if (rs_usuario.length == 0) {
                return res.send({
                    success: false,
                    message: "Não foi possível efeturar o login. Tente novamente mais tarde !"
                })
            }

            await db.query(`
            CALL PCD_CANTAI_INCLUIR_DADOS_DISPOSITIVO(${temp[0][0].ID_USUARIO}, 
            '${id_dispositivo}', 
            '${sistema_operacional}', 
            '${versao}', '${sdk_build}', '${modelo}', '${marca}', '${idioma_dispositivo}') `)

            const usuario = rs_usuario[0][0]

            var dados = jwt.sign({ id: result[0][0].ULTIMO_ID, nome: usuario.NOME })

            // // Instanciar MundiPagg
            // const mp = new MundiPagg('sk_test_769MDeEYHLF3DrVk')

            // // Inserir cliente
            // const customer_id = await mp.inserirCliente({
            //     id: result[0][0].ULTIMO_ID,
            //     nome: usuario.NOME,
            //     email: usuario.EMAIL
            // })

            // const mundi = await db.query(`
            //     CALL PCD_URUS_INCLUIR_MULTIPAGG_APP(${result[0][0].ULTIMO_ID}, '${customer_id}')
            //     `)

            // Retornar o ID
            return res.send({
                success: true,
                message: "OK",
                token: dados,
                bundle: {
                    usuario: usuario
                }
            })
        })
}
