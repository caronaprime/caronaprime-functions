
// Conexão
const db = require('db').asyncConnect()
const { Storage } = require('@google-cloud/storage')

const credentials = {
    "type": "service_account",
    "project_id": "appmaria-cantaish",
    "private_key_id": "316110fe8e1be63fb051659bd8826d6825341148",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDFZavyYA9gd9Lz\nBjjvxDV3Zt+O/0QKsltVJceiNKBRr79RMO0xVrOYb0npve9YYVYLJxLxlkaCpbGH\nyOCdMbxcsTvQIpoTVF4AHfQXy+epC8c2KIxI8p/np6KsI9RjAGpSa97SIv38frGJ\n8zF5RPhouxddCmYVsh+/JF+Tj309v1KrEWi8/E+UVJlQ3pboM6TbTQ8ir/JCgVq6\nHfIrSr/3p/IutKzic3M2tMsA1mPdgw1/Ehn9YrcU9Ge0WYaxOzS6TRT8bzwk7Qdh\nIwJzLQzkRLrir/wYgbVnX0U9QnzYb0mHxz4dcJpVWXrQmRBjD06u8K5NJ4aHMUXg\n7jWuHPcHAgMBAAECggEAAr1J+RefLwIKsee0s5MgANOzJ4tgWNuny9M15YjgbrHH\nMGvC5uvimyt0NaO2ph3XsVjt+N9ShC6je5RslZHioNCu2VEZnUoO8eZ4hDoGsYBh\n190RMVP4pyDa75Oht2wCjblEgtsMdkwVz6nJ1nqADggGp3pk90kdCqyJDQWxQcGX\nORecvTfuid13utFjT3SvOvGMT26/ZIYvfNBr2stFbANt1dc8PVxXWDOM6LxCvTb9\ncOKgkZJTfWEAB7bzxpGjB0sPhsqlxTlGHv48xMqGy29Zlv9mstraj21Vv9iLsmJQ\nmOrSx8iSi9bnWh9K1sssiHw3TlW7hUWeDOKSx+DlfQKBgQDkn7OOzpfA+rnePvu6\nOqI2mUQukFojj4FzzvS/xwT5krz7E+iXwXBE5891b1yyRmicKUj8eJuGrWqiNqph\n8fbvKsO0ojDq71BgxuYVN+2JhJufMAxJWUaon5F1jnXB/AVm++Q4CDMnO+cG8fH+\nE8pr6uN4kDzJlToe3FOg2/p9BQKBgQDdCL0tb4p7zGiaDp25ZacxSG4i3TDXxUX8\nT4glhieYtyZmEekxP8+dDlPIDCZigM1qeV9vXxccOKz7MSDcixP4vPgv1wchiTJw\nM/ZYCuRusjt3pEluRuLU+D8yAcBVRNZB5osmAAe8crAunreweTR35uJYEDjjOWu7\nfpZ0CvFBmwKBgAK1AWNHfvSCA4FmLYTe/Ny4o94JR4f0Qwwj/zHmIWDzI9m1OqPR\nXoryU7qIPwi9XK+8rWiP5QeLNiAFla7jNpFOaFLTONEPVFxQ/phxuRZPw6f24a5c\nqEGG4ioKLcrGOSonAWTIdBKa2vlyE/N2OIdemKLs0ktwwOdspHDbKfQhAoGAHOg2\nrYmH5/bsuzEsKYIE4qohVUfuSlnPdFcGbDnmVc+mIvU2tS0uPtEP3frQzlMgCkvD\nUnJyOEulO9jJ/m3l98LnBoKtuRITWZ9CGXObOmru4g/HVrfIlKe+xBB8kepFxyqa\niia43El3hzFUvqyrUv8MHQ5KElWBJG1CyfxgXv8CgYBEhiJW4KHJcLmPPIzK6jG5\n47wcfz8jy6pxvH9D8BP9S7cCHSLgbDYBeHFtQvqmdYY+gDOD/45MNS+5dDoDZvIt\nUcMdy6PBbDgIASSx8kxCRYa7u3/1+L4+WKQInk+pbZYwKS28LlalQZgIl41Zd22e\nJ7zHKw2FUQ58LEt3S8JqEQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "audios@appmaria-cantaish.iam.gserviceaccount.com",
    "client_id": "118000525388673235463",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/audios%40appmaria-cantaish.iam.gserviceaccount.com"
}  

module.exports = async (req, res) => {
var util = []
  const {id} = req.params;
  const {qualidade} = req.query;

    if(id == null){
        res.send({"success": false, "message": "Informe o id do album."});
    }
    if(qualidade == null){
        res.send({"success": false, "message": "Informe a qualidade."});
    }
    if(qualidade == 0){
        qualidade = 1;
    }

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var albuns = await db.query(`CALL PCD_CANTAI_LISTAR_ALBUM(${id}, ${req.jwt.id});`)

    var storage = new Storage({ "projectId": "appmaria-cantaish", "credentials": credentials })

    await util(albuns[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

        if (resultado.FAVORITADO == null) {
           resultado.FAVORITADO = "N"
        }
        
        var musicas = await db.query(`
           CALL PCD_CANTAI_LISTAR_MUSICAS_DO_ALBUM(${resultado.ID_ALBUM}, ${req.jwt.id})
        `)

        // foto do album
        var foto_album = el.FOTO_ALBUM
        var foto_album = el.FOTO_ALBUM

        await util(musicas[0], async (el, index) => {

            const options = {
                version: 'v4',
                action: 'read',
                expires: Date.now() + 120 * 60 * 1000
            }

            const [ url ] = await storage
                .bucket('audios.cantaish.com.br')
                .file(`${id}/${el.ID_MUSICA}-Q${qualidade}.mp3`)
                .getSignedUrl(options)

            el.LINK_MUSICA = url

            //el.LINK_MUSICA = `https://audios.cantaish.com.br/${id}/${el.ID_MUSICA}-Q${qualidade}.mp3`
            //el.LINK_MUSICA = `https://storage.googleapis.com/audio.cantaish.com.br/${id}/A${el.ID_MUSICA}.mp3`
            el.FOTO_MUSICA = foto_album
        })

        albuns[0][index].MUSICAS = musicas[0]

    })

    return res.send({ "ALBUM" : albuns[0] });

}
