
// Conexão
const db = require('db').asyncConnect()
const { PubSub } = require('@google-cloud/pubsub')
module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id_evento, descricao, categorias, nome, imagem, imagemPerfil, link_video, nomeMusica, audio } = req.body;
    // Validar parâmetros obrigatórios
    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Informe o nome do(a) candidato(a)"});
    }
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Escolha a foto do(a) candidato(a)"});
    }
    if (imagemPerfil == null || imagemPerfil == '' ) {
        return res.send({ "success": false, "message": "Escolha a foto de perfil do(a) candidato(a)"});
    }
    if (categorias == null || categorias == '' ) {
        return res.send({ "success": false, "message": "Escolha pelo menos uma categoria para o(a) candidato(a) concorrer"});
    }
    if (descricao == null || descricao == '' ) {
        return res.send({ "success": false, "message": "escreva a descrição do(a) candidato(a)"});
    }
    if (id_evento == null || id_evento == '' ) {
        return res.send({ "success": false, "message": "id do evento faltando"});
    }
    if(nomeMusica == null || nomeMusica == ''){
        var incluir_candidato = await db.query(`
            CALL PCD_CANTAI_INCLUSAO_CANDIDATO_SEM_LINK_MUSICA('${nome}', '${descricao}', '${imagem}', '${imagemPerfil}', '${link_video}');
            `)
        await util(categorias, async (el, index) => {
            await db.query(`
                CALL PCD_CANTAI_INCLUIR_CATEGORIAS_CANDIDATO_EVENTO(${el}, ${incluir_candidato[0][0].ID_CANDIDATOS}, ${id_evento});
                `)
        })
        return res.send({ "success": true });
    }else{
        var incluir_candidato = await db.query(`
            CALL PCD_CANTAI_INCLUSAO_CANDIDATO('${nome}', '${descricao}', '${imagem}', '${nomeMusica}', '${imagemPerfil}', '${link_video}');
            `)
        await util(categorias, async (el, index) => {
            await db.query(`
                CALL PCD_CANTAI_INCLUIR_CATEGORIAS_CANDIDATO_EVENTO(${el}, ${incluir_candidato[0][0].ID_CANDIDATOS}, ${id_evento});
                `)
        })

        const pubsub = new PubSub({projectId: "appmaria-cantaish"})
        const atributos = {
            idevento: ""+id_evento+"",
            idcandidato: ""+incluir_candidato[0][0].ID_CANDIDATOS+"",
            temporario: ""+audio+""
        }
        await pubsub
            .topic('vincular_audio_evento')
            .publish(Buffer.from("A"), atributos)

        console.log("====================")
        var link_storage_firebase = "https://storage.googleapis.com/eventos.cantaish.com.br/"+id_evento+"/"+incluir_candidato[0][0].ID_CANDIDATOS+"-Q1.mp3";
        console.log(link_storage_firebase)
        await db.query(`
            CALL PCD_CANTAI_ALTERAR_CANDIDATO_INSERIR_LINK_MUSICA(${incluir_candidato[0][0].ID_CANDIDATOS}, '${link_storage_firebase}');
            `)
        return res.send({ "success": true });
    }

}