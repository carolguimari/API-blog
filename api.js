const koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new koa();
server.use(bodyparser());

const autores = [
    {
        id: '0',
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@',
        senha: '567',
        deletado: false
    },
    
    {
        id: '1',
        nome: 'Maria',
        sobrenome: 'Pereira',
        email: 'bla',
        senha: '123',
        deletado: false
    }


]

const posts = [
    {
        id: '0',
        titulo: 'Um título qualquer',
        subtitulo: 'Um subtitutlo qualquer',
        autor:    {
            id: '0',
            nome: 'João',
            sobrenome: 'Silva',
            email: 'joao@',
            senha: '567',
            deletado: false
        },
        publicado: true,
        deletado: false
    },

    {
        id: '1',
        titulo: 'outro título qualquer',
        subtitulo: 'outro subtitulo qualquer',
        autor:  {
            id: '1',
            nome: 'Maria',
            sobrenome: 'Pereira',
            email: 'bla',
            senha: '123',
            deletado: false
        },
        publicado: true,
        deletado: false
    },

    {
        id: '2',
        titulo: 'Agora vai',
        subtitulo: '',
        autor:  {
            id: '1',
            nome: 'Maria',
            sobrenome: 'Pereira',
            email: 'bla',
            senha: '123',
            deletado: false
        },
        publicado: true,
        deletado: false
    }
]

/** Funções dos autores */

const buscarAutor = (id) => {
    let encontrado = false
   
    for (i = 0; i < autores.length; i++) {
      if (autores[i].id === id) {
         encontrado = true
          return autores[i]

      }
    }
       
    
    if (!encontrado) {
      return 'Autor não encontrado'
    }
    
}



const criarAutor = (novoAutor) => {
  
  novoAutor = {
    id: novoAutor.id,
    nome: novoAutor.nome,
    sobrenome: novoAutor.sobrenome,
    email: novoAutor.email,
    senha: novoAutor.senha,
    deletado: false
  }

autores.push(novoAutor)
return novoAutor

}

const deletarAutor = (id) => {
    buscarAutor(id)
    let autor = autores[i].id
    let postEncontrado = false

    for (i = 0; i < posts.length; i++) {
        if (posts[i].autor === autor) {
            postEncontrado = true
            return 'Você precisa apagar os posts desse autor antes de deletá-lo'
        }
    }

    if (!encontrado) {
       autores[i].deletado = true
       return autores
    }    
}


const atualizarAutor = (id, body) => {
    buscarAutor(id) 
    autores[i].id = id,
    autores[i].nome = body.nome,
    autores[i].sobrenome = body.sobrenome,
    autores[i].email = body.email,
    autores[i].senha = body.senha,
    autores[i].deletado = false

}

const perguntarAutor = () => {
    return 'Passe o id do autor da postagem que você quer fazer'
  }

/** Funções dos posts */

const listarPostTodos = () => {
    return posts
}

const listarPost = (id) => {
    let encontrado = false
    
    for (i = 0; i < posts.length; i++) {
      if (posts[i].id == id) {
         encontrado = true
          return posts[i]
    
      }
    }
       
    
    if (!encontrado) {
      return 'Post não encontrado'
    }

}

const criarPost = (id, body) => {
    buscarAutor(id)
    if (autores[i].deletado) {
        return 'Este autor foi deletado. Ação proibida'
    } else {
        let novoPost = {
            id: body.id,
            titulo: body.titulo,
            subtitulo: body.subtitulo,
            autor: {
                id: id,
                nome: body.autor.nome,
                sobrenome: body.autor.sobrenome,
                email: body.autor.email,
                senha: body.autor.senha,
                deletado: false
            },
            publicado: true,
            deletado: false
         }
        
        
         posts.push(novoPost)
         return posts
    }


}

const atualizarPost = (id, body) => {
    listarPost(id)
    posts[i].id = body.id,
    posts[i].titulo = body.titulo,
    posts[i].subtitulo = body.subtitulo,
    posts[i].autor = body.autor,
    posts[i].publicado = true,
    posts[i].deletado = false

    return posts[i]

}


const deletarPost = (id) => {
    listarPost(id)
    posts[i].deletado = true

    return posts[i]
}

const buscarPostsAutor = (index) => {
    let postsAutor = []

    for (i = 0; i < posts.length; i++) {
      if (posts[i].autor.id == index) {
         postsAutor.push(posts[i])
      }
    }
    return postsAutor
    
    }


const contexto = async(ctx) => {

    
    let body = ctx.request.body
    let caminho = ctx.originalUrl.split("/")
    let acao = caminho[2]
    let id = caminho[3]

    if (ctx.originalUrl.includes("/blog")) {
       
        if (acao === 'autor' && ctx.method === 'POST') {
            ctx.status =200
            ctx.body = criarAutor(body)
        } else if (acao === 'autor' && ctx.method === 'GET') {
                if (id !== '') {
                    ctx.status = 200
                    ctx.body = buscarAutor(id);
                } else {
                    ctx.status = 400
                    ctx.body = 'Você precisa informar um identificador!'
                }
        } else if (acao === 'autor' && ctx.method === 'DELETE') {
            if (id !== '') {
                ctx.status =200
                ctx.body = deletarAutor(id)
            } else {
                ctx.status = 400
                ctx.body = 'Você precisa informar um identificador!'
            }
        } else if (acao === 'autor' && ctx.method === 'PUT') {
            if (id !== '') {
                ctx.status = 200
                ctx.body = atualizarAutor(id, body)
            } else {
                ctx.status = 400
                ctx.body = 'Você precisa informar um identificador!'
            }
        } else if (acao === 'posts' && ctx.method === 'POST') {
            if (id !== '' && body !== '') {
                ctx.body = criarPost(id, body)
                if (criarPost(id, body) === 'Este autor foi deletado. Ação proibida') {
                    ctx.status = 403
                }
                
            } else {
                ctx.status = 400
                ctx.body = 'Você precisa informar o id do autor!'
            }
        } else if (acao === 'posts' && ctx.method === 'GET') {
            if (id !== '') {
                ctx.status =200
                ctx.body = listarPost(id)
            } else {
                ctx.status = 200
                ctx.body = listarPostTodos()
            } 
        } else if (acao === 'posts' && ctx.method === 'PUT') {
            if (id !== '') {
                ctx.status = 200
                ctx.body = atualizarPost(id, body)
            } else {
                ctx.status = 400
                ctx.body = 'Você precisa informar um identificador do post!'
            }
        } else if (acao === 'posts' && ctx.method === 'DELETE') {
            if (id !== '') {
                ctx.status =200
                ctx.body = deletarPost(id)
            } else {
                ctx.status = 400
                ctx.body = 'Você precisa informar um identificador do post!'
            }
        } else if (acao.substr(0,6) === 'posts?' && ctx.method === 'GET') {
            let index = acao.substr(12) 
            ctx.body = buscarPostsAutor(index)

        }


    } else {
        ctx.status = 404
        ctx.body = 'Conteúdo não encontrado!'
    }

}




server.use(contexto)

server.listen(8081, () => {
    console.log('Servidor rodando!')
})