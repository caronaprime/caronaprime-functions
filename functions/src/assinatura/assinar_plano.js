
// Conexão
const db = require('db').asyncConnect()

//MundiPagg
const MundiPagg = require('mundipagg')

const nodemailer = require('nodemailer')

// Configurar e-mail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "appcantaish@gmail.com",
        pass: "MusicaSh@lom1982"
    }
})

module.exports = async (req, res) => {

    var util = []
    const { plano,
        nome_usuario,
        sobrenome_usuario,
        email,
        confirm_email,
        numero_cartao,
        nome_cliente,
        mes_vencimento,
        ano_vencimento,
        cvv_cartao,
        endereco,
        cidade,
        estado,
        cep,
        codigo_promocional
    } = req.body;

    if (nome_usuario == null || nome_usuario == '') {
        res.send({ "success": false, "message": "Informe o nome do usuário." });
        return
    }
    if (sobrenome_usuario == null || sobrenome_usuario == '') {
        res.send({ "success": false, "message": "Informe o sobrenome do usuário." });
        return
    }
    if (plano == null || plano == '') {
        res.send({ "success": false, "message": "Informe o id do plano." });
        return
    }
    if (email == null || email == '') {
        res.send({ "success": false, "message": "Informe o e-mail." });
        return
    }
    if (confirm_email == null || confirm_email == '') {
        res.send({ "success": false, "message": "Informe o e-mail novamente para confirmar." });
        return
    }
    if (numero_cartao == null || numero_cartao == '') {
        res.send({ "success": false, "message": "Informe o número do cartão." });
        return
    }
    if (nome_cliente == null || nome_cliente == '') {
        res.send({ "success": false, "message": "Informe o nome do titular." });
        return
    }
    if (mes_vencimento == null || mes_vencimento == '') {
        res.send({ "success": false, "message": "Informe o mês de vencimento do cartão." });
        return
    }
    if (ano_vencimento == null || ano_vencimento == '') {
        res.send({ "success": false, "message": "Informe o ano de vencimento do cartão." });
        return
    }
    if (cvv_cartao == null || cvv_cartao == '') {
        res.send({ "success": false, "message": "CVV do cartão é obrigatório." });
        return
    }

    if (cvv_cartao.length > 4) {
        res.send({ "success": false, "message": "CVV deve conter 3 ou 4 dígitos" });
        return
    }

    var cvv2 = "" + cvv_cartao
    if (cvv2.length == 2) {
        //   res.send("entrou")
        cvv2 = "0" + cvv_cartao
    }


    // Verificar se usuario já não é premium e se ele existe
    var USUARIO = await db.query(`
        CALL PCD_CANTAI_OBTER_USUARIO_EMAIL_PAGAMENTO('${nome_usuario}', '${sobrenome_usuario}', '${email}');
    `)

    if (plano == 1) {
        res.send({ "success": false, "message": "Não conseguiu localizar o plano selecionado." });
        return
    }

    if (plano == 2) {
        res.send({ "success": false, "message": "Não conseguiu localizar o plano selecionado." });
        return
    }

    if (plano == 17 || plano == 18) {
        res.send({ "success": false, "message": "Não conseguiu localizar o plano selecionado." });
        return
    }

    // Fim das assinaturas por cartão
    if (plano > 18) {
        res.send({ "success": false, "message": "Não conseguiu localizar o plano selecionado." });
        return
    }

    //Ler plano de assinatura
    var PLANO = await db.query(`
        CALL PCD_CANTAI_OBTER_ASSINATURA_PAGAMENTO(${plano});
         `)


    if (PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_8YmndqBcG9c4v394' &&
        PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_Pn1Oj3B3FDTVXJMD' &&
        PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_RPvJjv4sVu1xgae8' &&
        PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_vnQjgWKTdSD7god6'
    ) {
        res.send({ "success": false, "message": "Plano selecionado não pode ser assinado como forma de pagamento cartão de crédito." });
        return
    }

    // Instanciar MundiPagg
    const mp = new MundiPagg('sk_3qLaPMEi0hVPxr0K')

    var nome = USUARIO[0][0].NOME + " " + USUARIO[0][0].SOBRENOME

    // Efetuar venda
    const result = await mp.assinarPlano({
        "plano": {
            "id": PLANO[0][0].CHAVE_MUNDIPAGG
        },
        "cliente": {
            "nome": nome,
            "email": email
        },
        "cartao": {
            "numero": numero_cartao,
            "nome": nome_cliente,
            "mes": mes_vencimento,
            "ano": ano_vencimento,
            "cvv": cvv2
        }
    })

    //TRATAMENTO DE ERROS
    //Request de erros
    if (result.message == "The request is invalid.") {
        //GRAVAR LOG
        await db.query(`
           CALL PCD_CANTAI_LOG_PAGAMENTO('${JSON.stringify(result)}');
        `)

        var json = JSON.parse(JSON.stringify(result));
        var r = ""

        //Verifica de onde vem a msg de erro
        if (json.errors.hasOwnProperty('subscription.card')) {
            r = json.errors["subscription.card"][0]
        }

        //Trata a msg
        i = JSON.stringify(r)
        i = i.replace('"', '').replace('"', '')

        //Mensagem padrão
        var erro = "Erro ao realizar o pagamento. Por favor tente mais tarde."

        //MSG de número inválido
        if (i == "The number field is not a valid card number") {
            erro = "Número do cartão inválido."
        }

        //MSG de cartão expirado
        if (i == "Card expired.") {
            erro = "Cartão expirado."
        }

        //MSG de número de CVV inválido
        if (i == "The field cvv must be a string with a minimum length of 3 and a maximum length of 4.") {
            erro = "Código de verificação do cartão deve ter 3 ou 4 dígitos."
        }

        if (i == "The card expiration date is invalid.") {
            erro = "Data informada está inválida."
        }

        res.send({
            "success": false,
            "message": erro
        });
    }


    if (result.status != "active") {
        await db.query(`
        CALL PCD_CANTAI_LOG_PAGAMENTO('${JSON.stringify(result)}');
     `)

        res.send({
            "success": false,
            "message": "Transação não autorizada"
        });

        return
    } else {

        await db.query(`
        CALL PCD_CANTAI_LOG_PAGAMENTO('${JSON.stringify(result)}');
     `)

        var ULTIMO_ID = await db.query(`
            CALL PCD_CANTAI_USUARIO_ASSINAR(${USUARIO[0][0].ID_USUARIO}, ${plano}, 1);
         `)

        await db.query(`
            CALL PCD_CANTAI_USUARIO_ASSINATURA_USUARIO(${USUARIO[0][0].ID_USUARIO}, '${ULTIMO_ID[0][0].ULTIMO_ID}');
         `)

         await db.query(`
            CALL PCD_CANTAI_INSERIR_TRANSACAO_V2(${USUARIO[0][0].ID_USUARIO}, 'CARTAO', 'N', ${plano}, ${codigo_promocional}, 'N', '${result.id}');
         `)



        // GRAVAR CODIGO ASINATURA
        //PCD_CANTAI_INCLUIR_CODIGO_ASSINATURA

        await db.query(`
            CALL PCD_CANTAI_INCLUIR_CODIGO_ASSINATURA('${result.id}', ${USUARIO[0][0].ID_USUARIO});
         `)


        const corpo = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Assinatura Cantai Sh - Confirmada</title>
        </head>
        <body style="margin:0px; background: #f8f8f8; ">
        <div width="100%" style="background: #f8f8f8; padding: 0px 0px; font-family:arial; line-height:28px; height:100%;  width: 100%; color: #514d6a;">
          <div style="max-width: 700px; padding:50px 0;  margin: 0px auto; font-size: 14px">
            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 20px">
              <tbody>
                <tr>
                  <td style="vertical-align: top; padding-bottom:30px;" align="center"><a href="http://cantaish.com.br" target="_blank"><img src="https://cantaish.com.br/images/icons/ic-logo-dark.png" height="80" alt="Cantai Sh" style="border:none"><br/>
                    </a> </td>
                </tr>
              </tbody>
            </table>
            <div style="padding: 40px; background: #fff;">
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tbody>
                  <tr>
                    <td>
                      <p>Esse e-mail confirma sua assinatura!</p>
                      <a href="https://apple.co/30ZHKLf" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; background-color: #db3355; color: white; border-radius: 60px; text-decoration:none;"> Baixar App Store </a>
                      <a href="http://bit.ly/2OUaB26" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; background-color: #db3355; color: white; border-radius: 60px; text-decoration:none;"> Baixar Play Store </a>
                      <p>Usar o mesmo e-mail para criar sua nova conta no aplicativo, caso já tenha logado no aplicativo com esse e-mail, deslogar do aplicativo e loga novamente com o mesmo e-mail que ativará sua conta Premium.</p>                      
                      <b>Obrigado, equipe Cantai Sh.</b> 
                    </td>
                  </tr>
                  
                </tbody>
              </table>
            </div>
            <div style="text-align: center; font-size: 12px; color: #b2b2b5; margin-top: 20px">
              <p> Todos os direitos reservados. </p>
            </div>
          </div>
        </div>
        </body>
        </html>
    `

        var maillist = [
            email,
            'appmariaoficial@gmail.com'
        ];

        // Enviar e-mail
        transporter.sendMail({
            from: "appcantaish@gmail.com",
            to: maillist,
            subject: "Assinatura Confirmada",
            html: corpo
        })

    }

    return res.send({ "success": true, "message": "sucesso" });
}
