function UsuariosDAO(connection){
    this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        /** Define a colleção para executar a query */
        const collection = db.collection('usuarios');

        /** Query a executar na coleção definida */
        collection.insert(usuario);
        client.close();
    });
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        const collection = db.collection('usuarios');
        collection.find(usuario).toArray(function(err, result){
            
            /** Verifica se encontrou algum registro no banco de dados */
            if(result[0] != undefined){
                /** Cria variável de sessão */
                req.session.autorizado = true;
                req.session.usuario = result[0].usuario;
                req.session.casa = result[0].casa;
            }

            /** Verifica a autenticação */
            if(req.session.autorizado){
                res.redirect("jogo");
            } 
            else{
                res.render("index", {validacao: [{msg: "Usuário ou senha inválidos!"}], usuario: usuario.usuario});
            }
        });

        client.close();
    });
}

module.exports = function(){
    return UsuariosDAO;
}