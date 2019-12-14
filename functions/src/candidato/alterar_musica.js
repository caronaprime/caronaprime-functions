
// Conexão
const db = require('db').asyncConnect()
const { PubSub } = require('@google-cloud/pubsub')
module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id, id_candidato, nomesMusicas, audio } = req.body;
    // Validar parâmetros obrigatórios
    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Evento não encontrado"});
    }
    if (id_candidato == null || id_candidato == '' ) {
        return res.send({ "success": false, "message": "candidato não encontrado"});
    }
    if (nomesMusicas == null || nomesMusicas == '' ) {
        return res.send({ "success": false, "message": "Música não encontrada"});
    }
    if (audio == null || audio == '' ) {
        return res.send({ "success": false, "message": "Problema no upload de audio"});
    }

    const pubsub = new PubSub({projectId: "appmaria-cantaish"})
    const atributos = {
        idevento: ""+id+"",
        idcandidato: ""+id_candidato+"",
        temporario: ""+audio+""
    }
    await pubsub
        .topic('vincular_audio_evento')
        .publish(Buffer.from("A"), atributos)

    console.log("====================")
    var link_storage_firebase = "https://storage.googleapis.com/eventos.cantaish.com.br/"+id+"/"+id_candidato+"-Q1.mp3";
    console.log(link_storage_firebase)
    await db.query(`
        CALL PCD_CANTAI_ALTERAR_CANDIDATO_LINK_MUSICA_ADM('${nomesMusicas}', '${audio}', ${id_candidato}, '${link_storage_firebase}');
        `)
    return res.send({ "success": true });

}