var ObjectId = require('mongodb').ObjectId;

function JogoDAO(connection){
    this._connection = connection;
}

JogoDAO.prototype.gerarParametros = function(usuario){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        /** Define a colleção para executar a query */
        const collection = db.collection('jogo');

        /** Query a executar na coleção definida */
        collection.insert({
            usuario: usuario,
            moeda: 15,
            suditos: 10,
            temor: Math.floor(Math.random() * 1000),
            sabedoria: Math.floor(Math.random() * 1000),
            comercio: Math.floor(Math.random() * 1000),
            magia: Math.floor(Math.random() * 1000) 
        });
        client.close();
    });
}

JogoDAO.prototype.iniciaJogo = function(usuario, casa, msg, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        /** Define a colleção para executar a query */
        const collection = db.collection('jogo');
        /** Query a executar na coleção definida */
        collection.find({usuario: usuario}).toArray(function(err, result){
            // console.log(result[0]);
            res.render("jogo", {img_casa: casa, jogo: result[0], msg: msg});  
        });

        client.close();
    });
}

JogoDAO.prototype.acao = function(acao){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        /** Define a colleção para executar a query */
        var collection = db.collection('acao');

        var date = new Date();
        var tempo = null;

        switch(parseInt(acao.acao)){
            case 1: 
            tempo = 1 * 60 * 60000;
            break;

            case 2: 
            tempo = 2 * 60 * 60000;
            break;

            case 3: 
            tempo = 5 * 60 * 60000;
            break;

            case 4: 
            tempo = 5 * 60 * 60000;
            break;
        }

        acao.acao_termina_em = date.getTime() + tempo;
        /** Query a executar na coleção definida */
        collection.insert(acao);

        // Muda de collection para realizar outra manipulação no banco
        collection = db.collection('jogo');

        var moedas = null;
        switch(parseInt(acao.acao)){
            case 1: 
            moedas = -2 * acao.quantidade;
            break;

            case 2: 
            moedas = -3 * acao.quantidade;
            break;

            case 3: 
            moedas = -1 * acao.quantidade;
            break;

            case 4: 
            moedas = -1 * acao.quantidade;
            break;
        }

        collection.update(
            {usuario: acao.usuario},
            { $inc: {moeda: moedas}}
        );
        client.close();
    });
}

/**
 * Retorna os documentos de ações com base no nome do usuário
 * @param {*} usuario Nome do usuario
 * @param {*} res Instancia do Objeto Response do Express
 * @returns View 'pergaminhos' renderizada com os dados
 */
JogoDAO.prototype.getAcoes = function(usuario, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        /** Define a colleção para executar a query */
        const collection = db.collection('acao');

        var date = new Date();
        var momento_atual = date.getTime();

        /** Query a executar na coleção definida */
        collection.find({usuario: usuario, acao_termina_em : {$gt : momento_atual}}).toArray(function(err, result){
            // console.log(result[0]);
            res.render('pergaminhos', {acoes: result});  
        });

        client.close();
    });
}

/**
 * Deleta um documento da coleção 'ação' no banco de dados
 * @param {*} _id Id do documento a ser removido
 */
JogoDAO.prototype.revogarAcao = function(_id, res){
    var mongoConnected = this._connection.connectToMongo(function(client, db){
        /** Define a colleção para executar a query */
        const collection = db.collection('acao');
        /** Query a executar na coleção definida */
        collection.remove(
            {_id : ObjectId(_id)},
            function(err, result){
                res.redirect('jogo?msg=D');
            }
        );

        client.close();
    });
}

module.exports = function(){
    return JogoDAO;
}