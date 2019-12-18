
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

    const { plano,
        nome_usuario,
        sobrenome_usuario,
        email,
        confirme_email,
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
    if (confirme_email == null || confirme_email == '') {
        res.send({ "success": false, "message": "Informe o e-mail novamente para confirmar." });
        return
    }
    if (endereco == null || endereco == '') {
        res.send({ "success": false, "message": "Informe o endereço." });
        return
    }
    if (cep == null || cep == '') {
        res.send({ "success": false, "message": "Informe o cep." });
        return
    }
    if (cidade == null || cidade == '') {
        res.send({ "success": false, "message": "Informe a cidade." });
        return
    }
    if (estado == null || estado == '') {
        res.send({ "success": false, "message": "Informe o estado." });
        return
    }

    if (plano == 21 || plano == 22) {
        res.send({ "success": false, "message": "Não conseguiu localizar o plano selecionado." });
        return
    }

    // Inicio das assinaturas por boleto
    if (plano < 19) {
        res.send({ "success": false, "message": "Não conseguiu localizar o plano selecionado." });
        return
    }

    // Fim das assinaturas por boleto
    if (plano > 22) {
        res.send({ "success": false, "message": "Não conseguiu localizar o plano selecionado." });
        return
    }


    // Verificar se usuario já não é premium e se ele existe
    var USUARIO = await db.query(`f
        CALL PCD_CANTAI_OBTER_USUARIO_EMAIL_PAGAMENTO('${nome_usuario}', '${sobrenome_usuario}', '${email}');
    `)

    //Ler plano de assinatura
    var PLANO = await db.query(`
        CALL PCD_CANTAI_OBTER_ASSINATURA_PAGAMENTO(${plano});
         `)

   
    if (PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_L64DwBsQOiNd37zG' &&
        PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_zRLN1zJIROumGrZ4' &&
        PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_2mqLKRmu8VI3MEJ9' &&
        PLANO[0][0].CHAVE_MUNDIPAGG != 'plan_OL3mglBT9sKrR72q' 
       ) {
        res.send({ "success": false, "message": "Plano selecionado não pode ser assinado como forma de pagamento boleto." });
        return
    }

    // Instanciar MundiPagg
    const mp = new MundiPagg('sk_3qLaPMEi0hVPxr0K')

    var nome = USUARIO[0][0].NOME + " " + USUARIO[0][0].SOBRENOME

    // Efetuar venda
    const result = await mp.assinarPlanoBoleto({
        "plano": {
            "id": PLANO[0][0].CHAVE_MUNDIPAGG
        },
        "cliente": {
            "nome": nome,
            "email": email,
            "documento": "04224177188",
            "endereco": {
                "linha_1": endereco,
                "cep": cep,
                "cidade": cidade,
                "uf": estado
            }
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
        CALL PCD_CANTAI_INSERIR_TRANSACAO_V2(${USUARIO[0][0].ID_USUARIO}, 'BOLETO', 'N', ${plano}, ${codigo_promocional}, 'S', '${result.id}');
         `)

        const corpo = `
         <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
         <html xmlns="http://www.w3.org/1999/xhtml">
         <head>
         <meta name="viewport" content="width=device-width" />
         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
         <title>Cantai Sh - Boleto</title>
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
                     <td style="text-align: center;">
                       <p>Faça o pagamento do boleto, para concluir a assinatura!</p>
                       <p style="text-align: center;">
                       <a href="${result.boleto}" style="display: inline-block; padding: 11px 30px; margin: 20px 0px 30px; font-size: 15px; background-color: #db3355; color: white; border-radius: 60px; text-decoration:none; text-align: center;"> Link do boleto </a></p>
                       <p>Você receberá outro e-mail assim que compensar o pagamento do boleto.</p>
                       
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
            subject: "Assinatura pendente",
            html: corpo
        })
    }

    return res.send({ "success": true, "message": result });
}
