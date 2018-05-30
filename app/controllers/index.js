module.exports.home = function(application, req, res){
    res.render('index', {validacao: {}, usuario: ''});
}

module.exports.autenticar = function(application, req, res){
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('index', {validacao: erros, usuario: dadosForm.usuario});
        return;
    }

    var connection = new application.config.dbConnection();
    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

    UsuariosDAO.autenticar(dadosForm, req, res);
    
    // res.send('Podemos criar sessao!');
    
}