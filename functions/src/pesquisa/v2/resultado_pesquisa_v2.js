
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
  var util = []
    const {pesquisa, qualidade} = req.query
    
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var topicos = await db.query(`CALL PCD_CANTAI_LISTAR_TOPICO_PESQUISA();`)

    await util(topicos[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

        if (resultado.ID_TOPICO_PESQUISA == 1) {
        
            var musicas = await db.query(`
             CALL PCD_CANTAI_LISTAR_MUSICAS_PESQUISA_V2(${req.jwt.id}, ${pesquisa})
           `)

          topicos[0][index].MUSICAS = musicas[0]
        }
        if (resultado.ID_TOPICO_PESQUISA == 2) {
        
            var artistas = await db.query(`
             CALL PCD_CANTAI_LISTAR_ARTISTAS_PESQUISA_V2(${req.jwt.id}, ${pesquisa})
           `)

          topicos[0][index].ARTISTAS = artistas[0]
        }
        if (resultado.ID_TOPICO_PESQUISA == 3) {
        
            var albuns = await db.query(`
             CALL PCD_CANTAI_LISTAR_ALBUNS_PESQUISA_V2(${req.jwt.id}, ${pesquisa})
           `)

          topicos[0][index].ALBUNS = albuns[0]
        }
        if (resultado.ID_TOPICO_PESQUISA == 4) {
        
            var playlists = await db.query(`
             CALL PCD_CANTAI_LISTAR_PLAYLIST_PESQUISA_V2(${req.jwt.id}, ${pesquisa})
           `)

          topicos[0][index].PLAYLISTS = playlists[0]
        }
        if (resultado.ID_TOPICO_PESQUISA == 5) {      
          var letras = await db.query(`
             CALL PCD_CANTAI_LISTAR_LETRAS_PESQUISA(${req.jwt.id}, ${pesquisa})
         `)

         await util(letras[0], async (el, index) => {
          if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
              el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
          }
         
        })

        topicos[0][index].LETRAS = letras[0]
      }
    })

    return res.send({ "TOPICOS" : topicos[0] });

}
