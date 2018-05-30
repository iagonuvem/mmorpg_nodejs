module.exports.cadastro = function(application, req,res){
    res.render('cadastro', {validacao: {}, dadosForm: {}, sucesso: {}});
}

module.exports.cadastrar = function(application, req,res){
    var dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();
    req.assert('casa', 'Casa não pode ser vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('cadastro', {validacao: erros, dadosForm: dadosForm, sucesso: {}});
        return;
    }

    var connection = new application.config.dbConnection();
    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
    var JogoDAO = new application.app.models.JogoDAO(connection);

    UsuariosDAO.inserirUsuario(dadosForm);
    JogoDAO.gerarParametros(dadosForm.usuario);

    var sucesso_return = [{msg: "Cadastrado com sucesso"}];

    res.render('cadastro', {validacao: {}, dadosForm: {}, sucesso: sucesso_return});
}