module.exports.home = function(application, req, res){

    if(req.session.autorizado !== true){
        //res.send("Usuário não conectado!");
        res.redirect('/');
        return;
    }

    var msg = '';
    if(req.query.msg != ''){
        msg = req.query.msg;
    }

    var usuario = req.session.usuario;
    var casa = req.session.casa;

    var connection = new application.config.dbConnection();
    var JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.iniciaJogo(usuario, casa, msg, res);
}
module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
        // res.render("index", {validacao: {}});
        res.redirect('/');
    });
}

module.exports.suditos = function(application, req, res){
    if(req.session.autorizado !== true){
        //res.send("Usuário não conectado!");
        res.send("Usuário precisa fazer login");
        return;
    }

    res.render('aldeoes', {validacao: {}});
}

module.exports.pergaminhos = function(application, req, res){
    if(req.session.autorizado !== true){
        //res.send("Usuário não conectado!");
        res.send("Usuário precisa fazer login");
        return;
    }

    /** Recuperar as ações no banco de dados */
    var connection = new application.config.dbConnection();
    var JogoDAO = new application.app.models.JogoDAO(connection);

    var usuario = req.session.usuario;
    JogoDAO.getAcoes(usuario, res);
}

module.exports.ordenar_acao_sudito = function(application, req, res){

    if(req.session.autorizado !== true){
        //res.send("Usuário não conectado!");
        res.send("Usuário precisa fazer login");
        return;
    }

    var dadosForm = req.body;

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo?msg=A');
        return;
    }

    var connection = new application.config.dbConnection();
    var JogoDAO = new application.app.models.JogoDAO(connection);

    //Adiciona uma nova chave 'usuario' à dadosForm
    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=B');
}

module.exports.revogar_acao = function(application, req , res){
    var url_query = req.query;
    
    var connection = new application.config.dbConnection();
    var JogoDAO = new application.app.models.JogoDAO(connection);

    var _id = url_query.id_acao;
    JogoDAO.revogarAcao(_id, res);
}