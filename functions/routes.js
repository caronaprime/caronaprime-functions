/*
    Rotas da API
*/
const jwt = require('jwt').middleware
// Roteador
exports.router = (app) => {

    //LOGIN
    app.post('/v1/login', require('./src/login/login'))
    app.post('/v2/login', require('./src/login/v2/login_v2'))
    // FEED
    app.get('/v1/feed', require('./src/feed/feed'))
    app.get('/v2/feed', jwt, require('./src/feed/feed_v2.js'))
    //INCLUIR FEED - ADM
    app.post('/v1/feed/incluir_adm', require('./src/feed/incluir_adm'))
    //LISTAGEM DE FEEDS - ADM
    app.get('/v1/listarFeeds', require('./src/feed/listar_adm'))
    //ATIVAR FEED NO APLICATIVO
    app.post('/v1/feed/ativar_adm', require('./src/feed/ativar_adm'))
    //INATIVAR FEED NO APLICATIVO
    app.post('/v1/feed/inativar_adm', require('./src/feed/inativar_adm'))
    //ALTERAR FEED
    app.post('/v1/feed/alterar_adm', require('./src/feed/alterar_adm'))
    // PESQUISA
    app.get('/v1/pesquisas', require('./src/pesquisa/mais_pesquisados.js'))
    app.get('/v1/pesquisa/premiuns', jwt, require('./src/pesquisa/premiuns.js'))
    app.get('/v1/pesquisa/musicas', require('./src/pesquisa/musicas.js'))
    app.get('/v1/pesquisa/albuns', require('./src/pesquisa/albuns.js'))
    app.get('/v1/pesquisa/playlists', require('./src/pesquisa/playlists.js'))
    app.get('/v1/pesquisa/artistas', require('./src/pesquisa/artistas.js'))
    app.get('/v1/pesquisa/letras', jwt, require('./src/pesquisa/letras.js'))
    app.get('/v1/resultado/pesquisa', jwt, require('./src/pesquisa/resultado_pesquisa.js'))
    app.post('/v1/login_adm', require('./src/login/login_adm'))
    app.post('/v1/pesquisa/incluir', require('./src/pesquisa/incluir_pesquisados.js'))
    // PESQUISA V2
    app.get('/v2/resultado/pesquisa', jwt, require('./src/pesquisa/v2/resultado_pesquisa_v2.js'))
    app.get('/v2/pesquisa/musicas', jwt, require('./src/pesquisa/v2/musicas_v2.js'))
    app.get('/v2/pesquisa/albuns', jwt, require('./src/pesquisa/v2/albuns_v2.js'))
    app.get('/v2/pesquisa/playlists', jwt, require('./src/pesquisa/v2/playlists_v2.js'))
    app.get('/v2/pesquisa/artistas', jwt, require('./src/pesquisa/v2/artistas_v2.js'))

    // FAVORITOS
    app.post('/v1/album/favoritar', jwt, require('./src/album/favoritar'))
    app.post('/v1/musica/favoritar', jwt, require('./src/musica/favoritar'))
    app.post('/v1/artista/favoritar', jwt, require('./src/artista/favoritar'))
    app.post('/v1/album/desfavoritar', jwt, require('./src/album/desfavoritar'))
    app.post('/v1/musica/desfavoritar', jwt, require('./src/musica/desfavoritar'))
    app.post('/v1/artista/desfavoritar', jwt, require('./src/artista/desfavoritar'))

    //ALBUM
    //LISTAGEM DE ALBUM DO ALBUM E SUAS MUSICAS - OK
    app.get('/v1/album/:id', jwt, require('./src/album/listar'))
    app.get('/v1/favoritos/albuns', jwt, require('./src/favoritos/albuns_favoritos'))
    //ALTERAR ARTISTAS
    app.post('/v1/album/alterar', require('./src/album/alterar'))
    //PLAYLIST
    app.get('/v1/playlist/listar', jwt, require('./src/playlist/listar'))
    app.get('/v1/playlist/musicas/:id', jwt, require('./src/playlist/musicas_playlist.js'))
    app.post('/v1/playlist/incluir', jwt, require('./src/playlist/incluir'))
    app.put('/v1/playlist/alterar', jwt, require('./src/playlist/alterar'))
    app.delete('/v1/playlist/excluir/:id', jwt, require('./src/playlist/excluir.js'))
    app.post('/v1/playlist/incluir/musica', jwt, require('./src/playlist/incluir_musica.js'))
    app.post('/v1/playlist/excluir/musica', jwt, require('./src/playlist/excluir_musica.js'))
    // PREMIUNS

    //BANNER
    //LISTAGEM DE BANNERS - OK
    app.get('/v1/banners', require('./src/banner/listar'))
    app.get('/v2/banners', jwt, require('./src/banner/v2/listar_v2'))
    //LISTAGEM DE BANNERS PELO ADM
    app.get('/v1/banners_adm', require('./src/banner/listar_adm'))
    //ATIVAR CATEGORIA
    app.post('/v1/banner/ativar_adm', require('./src/banner/ativar_adm'))
    //INATIVAR CATEGORIA
    app.post('/v1/banner/inativar_adm', require('./src/banner/inativar_adm'))
    //CATEGORIA
    //LISTAGEM DE CATEGORIAS - OK
    app.get('/v1/categorias', require('./src/categoria/listar'))
    //LISTAGEM DE CATEGORIAS - ADM
    app.get('/v1/adm/categorias', require('./src/categoria/listar_adm'))
    //EXCLUIR CATEGORIA - ADM
    app.post('/v1/categoria/excluir', require('./src/categoria/excluir'))
    //INCLUIR CATEGORIA - ADM
    app.post('/v1/categoria/incluir', require('./src/categoria/incluir'))
    //ATIVAR CATEGORIA
    app.post('/v1/categoria/ativar_adm', require('./src/categoria/ativar_adm'))
    //INATIVAR CATEGORIA
    app.post('/v1/categoria/inativar_adm', require('./src/categoria/inativar_adm'))
    //ALTERAR CATEGORIA
    app.post('/v1/categoria/alterar_adm', require('./src/categoria/alterar_adm'))
    //CATEGORIA POR VOTACAO
    //INCLUIR CATEGORIA PARA VOTAÇÃO - ADM
    app.get('/v1/categorias_votacao', require('./src/categoria/listar_categoria_votacao'))
    //INCLUIR CATEGORIA PARA VOTACAO- ADM
    app.post('/v1/categoria_votacao/incluir', require('./src/categoria/incluir_categoria_votacao'))
    //EXCLUIR CATEGORIA VOTACAO- ADM
    app.post('/v1/categoria_votacao/excluir', require('./src/categoria/excluir_categoria_votacao'))
    //ATIVAR CATEGORIA VOTACAO
    app.post('/v1/categoria_votacao/ativar_adm', require('./src/categoria/ativar_categoria_votacao_adm'))
    //INATIVAR CATEGORIA
    app.post('/v1/categoria_votacao/inativar_adm', require('./src/categoria/inativar_categoria_votacao_adm'))
    //ALTERAR CATEGORIA
    app.post('/v1/categoria_votacao/alterar_adm', require('./src/categoria/alterar_categoria_votacao_adm'))
    //MUSICA
    app.post('/v1/musica/ouvida', jwt, require('./src/musica/ouvida'))
    //LISTAGEM DE MUSICAS - FEED PRINCIPAL
    app.get('/v1/musicas', require('./src/musica/listar'))
    //OBTER MUSICA
    app.get('/v1/musicas/:id', require('./src/musica/obter'))
    //LISTAGEM DE MÚSICAS POR CATEGORIA
    app.get('/v1/musicas/categoria/:id', require('./src/musica/obter_musica_categoria'))
    app.get('/v2/musicas/categoria/:id', jwt, require('./src/musica/v2/obter_musica_categoria_v2'))
    //app.get('/v1/musicas/categoria', require('./src/musica/listar_por_categoria'))
    //LISTAR_MUSICAS_DOS_ALBUNS
    app.get('/v1/listarMusicas/:id', require('./src/musica/listar_musicas_do_album'))
    //EXCLUIR MUSICA POR - ADM
    app.post('/v1/musica/excluir', require('./src/musica/excluir'))
    //SEQUENCIAR MUSICAS POR - ADM
    app.post('/v1/musica/sequenciar', require('./src/musica/sequenciar'))
    //INCLUIR MUSICAS POR ADM
    app.post('/v1/musica/incluir', require('./src/musica/incluir'))
    //INCLUIR LETRA DA MUSICA
    app.post('/v1/musica/incluir_letra', require('./src/musica/incluir_letra'))
    //INCLUIR LETRA DA MUSICA
    app.post('/v1/musica/mudar_nome', require('./src/musica/novo_nome'))
    // FAVORITOS
    app.get('/v1/favoritos/musicas', jwt, require('./src/favoritos/musicas_favoritas'))

    //USUARIO
    //LISTAGEM DE MUSICAS OUVIDAS RECENTEMENTE
    app.get('/v1/usuario/musicas/recentes', jwt, require('./src/usuario/tocadas_recentemente.js'))
    //LISTAGEM DE ALBUNS FAVORITADOS PELO USUARIO
    app.get('/v1/usuario/favoritos/albuns', jwt, require('./src/usuario/favorito/albuns'))
    //LISTAGEM DE MUSICAS FAVORITADAS PELO USUARIO
    app.get('/v1/usuario/favoritos/musicas', jwt, require('./src/usuario/favorito/musicas'))
    //LISTAGEM DE ARTISTAS FAVORITADOS PELO USUARIO
    app.get('/v1/usuario/favoritos/artistas', jwt, require('./src/usuario/favorito/artistas'))
    app.get('/v1/uteis/gerador', require('./src/uteis/gerador_codigo'))
    //GERADOR DE CODIGO DE TESTE
    app.get('/v1/uteis/gerador_teste', require('./src/uteis/gerador_codigo_teste'))

    //validar imagem
    app.post('/v1/validar/imagem', require('./src/validacao/validarImagem'))
    //ARTISTA
    //CADASTRAR ARTISTA
    app.post('/v1/artista/incluir', require('./src/artista/incluir'))
    //LISTAR ARTISTA PARA POPULAR SELECT
    app.get('/v1/sel/artistas', require('./src/artista/listar_select'))
    //LISTAGEM DE ARTISTA
    app.get('/v1/artistas', require('./src/artista/listar'))
    //ALTERAR ARTISTAS
    app.post('/v1/artista/alterar', require('./src/artista/alterar'))
    // ARTISTAS FAVORITOS
    app.get('/v1/favoritos/artistas', jwt, require('./src/favoritos/artistas_favoritos'))
    // LISTAR ALBUNS DO ARTISTA
    app.get('/v1/artista/albuns/:id', jwt, require('./src/artista/albuns_artista.js'))
    //ATIVAR ARTISTA
    app.post('/v1/artista/ativar_adm', require('./src/artista/ativar_adm'))
    //INATIVAR ARTISTA
    app.post('/v1/artista/inativar_adm', require('./src/artista/inativar_adm'))

    //ALBUM
    //INCLUIR ALBUM
    app.post('/v1/album/incluir', require('./src/album/incluir'))
    //LISTAGEM DE ALBUM
    app.get('/v1/albuns', require('./src/album/listar_adm'))
    //PUBLICAR ALBUM NO APLICATIVO
    app.post('/v1/album/publicar', require('./src/album/publicar'))
    //RETIRAR ALBUM DO APLICATIVO
    app.post('/v1/album/retirar', require('./src/album/retirar'))
    //EXCLUIR ALBUM DO ADM
    app.post('/v1/album/excluir', require('./src/album/excluir'))

    // CONFIGURACOES APP (PERFIL, SENHA, RECEBER NOTIFICACOES)
    app.put('/v1/notificacao/preferencia', jwt, require('./src/configuracoes/notificacao.js'))
    app.put('/v1/perfil/preferencia', jwt, require('./src/configuracoes/perfil_publico.js'))
    app.put('/v1/perfil/alterar', jwt, require('./src/configuracoes/alterar_perfil.js'))
    app.put('/v1/perfil/alterar/senha', jwt, require('./src/configuracoes/alterar_senha.js'))
    app.put('/v1/perfil/alterar/qualidade', jwt, require('./src/configuracoes/alterar_qualidade_audio.js'))

    //EVENTO
    //LISTAGEM DE EVENTOS
    app.get('/v1/eventos', require('./src/evento/listar'))
    //INCLUIR EVENTOS
    app.post('/v1/evento/incluir', require('./src/evento/incluir'))
    //LISTAR CANDIDATOS DO EVENTO
    app.post('/v1/evento/candidatos', require('./src/evento/listar_candidatos'))
    //LISTAR CANDIDATOS DO EVENTO
    app.post('/v1/evento/votar', jwt, require('./src/evento/votar'))
    //ATIVAR EVENTO
    app.post('/v1/evento/ativar_adm', require('./src/evento/ativar_adm'))
    //INATIVAR EVENTO
    app.post('/v1/evento/inativar_adm', require('./src/evento/inativar_adm'))
    //ALTERAR EVENTO
    app.post('/v1/evento/alterar_adm', require('./src/evento/alterar_adm'))
    //LISTAR CANDIDATOS DO EVENTO
    app.get('/v1/evento/candidatos/:id', require('./src/evento/listar_candidatos_adm'))
    //LISTAR CANDIDATO DO EVENTO
    app.get('/v1/evento/candidato/:id', require('./src/evento/listar_candidato_adm'))
    //ALTERAR CANDIDATOS
    app.post('/v1/evento/candidatos/alterar_candidatos_adm', require('./src/evento/alterar_candidatos_adm'))
    //ASSINATURAS
    //LISTAR PLANOS DE ASSINATURA
    app.get('/v1/assinaturas', require('./src/assinatura/listar'))
    app.options('/v1/assinaturas', require('./src/header/options'))
    //ASSINAR PLANO
    app.post('/v1/assinaturas/assinar', require('./src/assinatura/assinar_plano'))
    app.options('/v1/assinaturas/assinar', require('./src/header/options'))


    app.post('/v1/assinaturas/assinar/manual', require('./src/assinatura/assinar_plano_manual'))
    app.options('/v1/assinaturas/assinar/manual', require('./src/header/options'))
    
    //BOLETO
    app.post('/v1/assinaturas/boleto', require('./src/assinatura/assinar_plano_boleto'))
    app.options('/v1/assinaturas/boleto', require('./src/header/options'))

    //CANCELAR PLANO
    app.get('/v1/assinaturas/cancelar', require('./src/assinatura/cancelar_plano'))
    app.options('/v1/assinaturas/cancelar', require('./src/header/options'))

    //LISTA PLANO ATUAL DO USUARIO
    app.get('/v1/assinaturas/usuario', jwt, require('./src/assinatura/listar_plano_usuario'))
    //RESGATAR PREMIUM POR TELEFONE
    app.post('/v1/assinaturas/resgatar/telefone', jwt, require('./src/assinatura/resgatar_premium_telefone'))
    //RESGATAR PREMIUM POR CODIGO
    app.post('/v1/assinaturas/resgatar/codigo', jwt, require('./src/assinatura/resgatar_premium_codigo'))
    //COMPARTILHAR PLANO
    app.post('/v1/assinaturas/compartilhar', jwt, require('./src/assinatura/compartilhar_plano.js'))
    //LISTAR USUARIOS COMPARTILHADOS DO PLANO FAMILIA
    app.get('/v1/assinaturas/listar/compartilhamento', jwt, require('./src/assinatura/listar_usuarios_compartilhados.js'))
    //REMOVER USUÁRIOS COMPARTILHADOS DO PLANO FAMILIA
    app.post('/v1/assinaturas/compartilhamento/remover', jwt, require('./src/assinatura/remover_usuarios_compartilhados.js'))

    //MUNICIPIO
    //LISTAGEM DE MUNICIPIOS - ADM  
    app.get('/v1/municipios', require('./src/municipio/listar'))
    //CANDIDATO
    //OBTER CATEGORIAS PARA VOTAÇÃO DO EVENTO
    app.get('/v1/categoriasVotacao/:id', jwt, require('./src/categoria/obter_categoria_votacao'))
    //OBTER CATEGORIAS PARA VOTAÇÃO DO EVENTO
    app.get('/v1/categoriasVotacao2/:id', require('./src/categoria/obter_categoria_votacao_2'))
    //INCLUIR CANDIDATO
    app.post('/v1/candidato/incluir', require('./src/candidato/incluir'))
    //INCLUIR CANDIDATO
    app.post('/v1/candidato/alterar_musica', require('./src/candidato/alterar_musica'))
    //LISTAR CATEGORIAS PARA VOTAÇÃO DO EVENTO
    app.get('/v1/listarCategoriasVotacaoEvento/:id', require('./src/categoria/listar_categorias_votacao_evento'))
    //BANNER
    //LISTAR TODAS AS MÚSICAS PARA O ADM
    app.get('/v1/musicas_todas_adm', require('./src/musica/listar_todas_musicas_adm'))
    //INCLUIR MÚSICA NO BANNER
    app.post('/v1/banner/incluir_musica_adm', require('./src/banner/incluir_musica_banner'))
    //LISTAR TODOS OS ARTISTAS PARA O ADM
    app.get('/v1/artistas_todos_adm', require('./src/album/listar_todos_artistas_adm'))
    //INCLUIR ARTISTA NO BANNER
    app.post('/v1/banner/incluir_artista_adm', require('./src/banner/incluir_artista_banner'))
    //LISTAR TODOS OS ALBUNS PARA O ADM
    app.get('/v1/album_todos_adm', require('./src/album/listar_todos_albuns_adm'))
    //INCLUIR ARTISTA NO BANNER
    app.post('/v1/banner/incluir_album_adm', require('./src/banner/incluir_album_banner'))
    //INCLUIR ARTISTA NO BANNER
    app.post('/v1/banner/incluir_link_adm', require('./src/banner/incluir_link_banner'))
    //FEED
    //FEED ADM, ACOMPANHAMENTO  VOTACAO EM TEMPO REAL
    app.get('/v1/votacaoTempoReal', require('./src/feed/votacao_tempo_real'))
    //FEED ADM, ACOMPANHAMENTO  VOTACAO EM TEMPO REAL
    app.post('/v1/acompanhar_adm', require('./src/feed/acompanhar_adm'))
    //TOKEN ASSINATURA
    //LISTAR OS CÓDIGOS TOKENS DE ASSINANTURA
    app.get('/v1/uteis/listar_adm', require('./src/uteis/listar_adm'))
    //LISTAR OS CÓDIGOS TOKENS DE ASSINANTURA
    app.post('/v1/uteis/validar_adm', require('./src/uteis/validar_adm'))
    //ENVIAR EMAIL
    app.get('/v1/uteis/email', require('./src/uteis/enviar_email'))
    //ENVIAR SMS
    app.get('/v1/uteis/sms', require('./src/uteis/enviar_sms'))

    //LISTAR LETRAS
    app.post('/v1/letras', jwt, require('./src/letras/listar'))
    app.get('/v1/letras/categorias', jwt, require('./src/letras/listar_categorias.js'))
    app.get('/v1/letras/subcategorias', jwt, require('./src/letras/listar_subcategorias.js'))
    app.get('/v1/letras/obter/:id', jwt, require('./src/letras/obter.js'))

    //PLAYLIST V2
    app.post('/v2/playlist/incluir', jwt, require('./src/playlist/v2/incluir'))
    app.put('/v2/playlist/alterar', jwt, require('./src/playlist/v2/alterar'))
    //app.delete('/v2/playlist/excluir/:id', jwt, require('./src/playlist/v2/excluir.js')) // Não precisa da v2
    app.get('/v2/playlist/letras/:id', jwt, require('./src/playlist/v2/letras_playlist.js'))

    //app.get('/v2/playlist/listar', jwt, require('./src/playlist/v2/listar')) // Não precisa da V2

    app.post('/v2/playlist/incluir/letra', jwt, require('./src/playlist/v2/incluir_letra.js'))
    app.post('/v2/playlist/excluir/letra', jwt, require('./src/playlist/v2/excluir_letra.js'))


    //app.post('/verificar/email', require('./src/assinatura/teste-email.js'))
    app.get('/assinatura/email', require('./src/assinatura/email.js'))
}
