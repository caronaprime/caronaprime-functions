
// Conexão
const db = require('db').asyncConnect()

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

    const { 
        nome_usuario,
        sobrenome_usuario,
        email
    } = req.body;

    if (nome_usuario == null || nome_usuario == '') {
        res.send({ "success": false, "message": "Informe o nome do usuário." });
        return
    }
    if (sobrenome_usuario == null || sobrenome_usuario == '') {
        res.send({ "success": false, "message": "Informe o sobrenome do usuário." });
        return
    }
    
    if (email == null || email == '') {
        res.send({ "success": false, "message": "Informe o e-mail." });
        return
    }

    var ULTIMO_ID = await db.query(`
            CALL PCD_CANTAI_USUARIO_ASSINAR(11643, 19, 12);
         `)

    await db.query(`
            CALL PCD_CANTAI_USUARIO_ASSINATURA_USUARIO(11643, ${ULTIMO_ID[0][0].ULTIMO_ID});
         `)

    await db.query(`
            CALL PCD_CANTAI_INCLUIR_CODIGO_ASSINATURA('sub_mqbJ4jbIwLHOA7Y6', 11643);
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



    return res.send({ "success": true, "message": "sucesso" });
}
