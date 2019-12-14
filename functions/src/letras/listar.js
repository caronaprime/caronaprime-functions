
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const { categoria, subcategoria, pesquisa, qualidade, tipo_pesquisa, titulo_letra, artista_letra, trecho_letra } = req.body;
    if (qualidade == null) {
        res.send({ "success": false, "message": "Informe a qualidade." });
    }
    if (qualidade == 0) {
        qualidade = 1;
    }

    const { pagina } = req.query
    if (pagina == null) {
        pagina = 0;
    }

    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    if (categoria > 0) {
        if (pagina == 0) {
            var categorias = await db.query(`CALL PCD_CANTAI_OBTER_CATEGORIA_LETRAS(${req.jwt.id}, ${categoria});`)

            await util(categorias[0], async (el, index) => {
                if (tipo_pesquisa == "simples") {
                    var letras = await db.query(`CALL PCD_CANTAI_LETRAS_FILTRO(${req.jwt.id}, '${pesquisa}', ${categoria});`)

                    await util(letras[0], async (el, index) => {
                        if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
                            el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
                        }
                    })
                } else {
                    if (subcategoria > 0) {
                        var letras = await db.query(`CALL PCD_CANTAI_LETRAS_FILTRO_AVANCADO_SUBCATEGORIA(${req.jwt.id}, '${titulo_letra}', '${artista_letra}', '${trecho_letra}', ${categoria}, ${subcategoria});`)

                        await util(letras[0], async (el, index) => {
                            if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
                                el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
                            }
                        })
                    } else {
                        var letras = await db.query(`CALL PCD_CANTAI_LETRAS_FILTRO_AVANCADO(${req.jwt.id}, '${titulo_letra}', '${artista_letra}', '${trecho_letra}', ${categoria});`)

                        await util(letras[0], async (el, index) => {
                            if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
                                el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
                            }
                        })
                    }
                }

                categorias[0][index].LETRAS = letras[0]
            })

            return res.send({ "items": categorias[0] });
        }

    } else {
        if (pesquisa == "") {
            var categorias = await db.query(`CALL PCD_CANTAI_LISTAR_CATEGORIAS_LETRAS(${req.jwt.id}, ${pagina});`)
        } else {
            var categorias = await db.query(`CALL PCD_CANTAI_LISTAR_CATEGORIAS_LETRAS_TODAS(${req.jwt.id});`)
        }

        await util(categorias[0], async (el, index) => {
            if (tipo_pesquisa == "simples") {
                var letras = await db.query(`CALL PCD_CANTAI_LETRAS_FILTRO(${req.jwt.id}, '${pesquisa}', ${el.ID_LETRAS_CATEGORIA});`)

                await util(letras[0], async (el, index) => {
                    if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
                        el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
                    }
                })
            } else {
                var letras = await db.query(`CALL PCD_CANTAI_LETRAS_FILTRO_AVANCADO(${req.jwt.id}, '${titulo_letra}', '${artista_letra}', '${trecho_letra}', ${el.ID_LETRAS_CATEGORIA});`)

                await util(letras[0], async (el, index) => {
                    if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
                        el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
                    }
                })
            }

            categorias[0][index].LETRAS = letras[0]
        })

        return res.send({ "items": categorias[0] });
    }

}
