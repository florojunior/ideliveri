const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.adicionaParceirosUrser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){return res.status(500).send({error: error}) }
        conn.query(`SELECT * FROM parceiros_users WHERE email = ?`,
            [req.body.email],
            (error, result) => {
                if (error){return res.status(500).send({error: error}) }
                if (result.length > 0 ) {
                    res.status(409).send({mensagem: "Email já Cadastrado!!!"})
                }else{
                    //Valida e Gera senha criptografada - hash é a se ha ja criptografada
                    bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                        if(errBcrypt){ return res.status(500).send({ error: errBcrypt})}
                        conn.query(
                            'INSERT INTO parceiros_users (id_parceiro, nome, email, password) VALUES (?,?,?,?)',
                            [req.body.id_parceiro,req.body.nome, req.body.email, hash],
                            (error, result, field) => {
                                conn.release(); // fecha a conexao com o banco
                                if (error){return res.status(500).send({error: error}) }                                
                                const response = {
                                    mensagem: "Usuário inserido com Sucesso!",
                                    usuarioCriado: {
                                        id : result.insertId,
                                        nome: req.body.nome,
                                        email: req.body.email,
                                        id_parceiro: req.body.id_parceiro,                           
                                        },                                                                
                                        request: {
                                            tipo: 'GET',
                                            descricao: 'Retorna todos os Usuários',
                                            url: 'http://localhost:3000/parceiros/users'
                                        }
                                    }
                                    return res.status(201).send(response);                
                            })
                    });
                }
            }
        )        
    });
};


exports.loginParceiroUserController = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        const query= `SELECT * FROM parceiros_users WHERE email = ?`;
        conn.query(query,[req.body.email], (error, results, field) =>{
            conn.release(); // Fecha a conexão com o Banco
            if(error){ return res.status(500).send({error: error})}
            //  console.log(results);
            if (results.length < 1){
                return res.status(401).send({mensagem: "Falha na autenticação"})
            }
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err){
                    return res.status(401).send({mensagem: "Falha na autenticação"})
                }
                if (result){
                    const token = jwt.sign({
                        id: results[0].id,
                        nome: results[0].nome,
                        email: results[0].email,
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                    )
                    return res.status(200).send({
                        mensagem: "Autenticado com Sucesso",
                        token : token
                        //Testar o Token em http://jwt.io
                    })
                }
                return res.status(401).send({mensagem: "Falha na autenticação"})
            });
        });
    });
};

exports.listasParceirosUsersController = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({ error: error}) }
        conn.query(
                `SELECT 
                    parceiros_users.id AS id_user,
                    parceiros.id AS id_parceiro,
                    parceiros.nome AS parceiro,
                    parceiros_users.nome,
                    parceiros_users.email
                FROM parceiros_users
                INNER JOIN parceiros
                ON parceiros.id = parceiros_users.id_parceiro;`,
            (error, result, field) => {
                conn.release(); // fecha a conexao com o banco
                if (error){ return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    parceiros_users: result.map(users => {
                        return{                            
                            id_user: users.id_user,
                            id_parceiro: users.id_parceiro,
                            parceiro: users.parceiro,
                            nome: users.nome,
                            email: users.email,
                            password: users.password,
                           
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um Usuário especifico pelo ID',
                                url: 'http://localhost:3000/parceiros_users/' + users.id_user
                            }
                        }
                    })

                }
                 return res.status(200).send({ response: response})                
            }
        )

    });
};

exports.listasParceirosUsersIdController = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({ error: error}) }
        conn.query(           
            `SELECT 
                parceiros_users.id AS id_user,
                parceiros.id AS id_parceiro,
                parceiros.nome AS parceiro,
                parceiros_users.nome,
                parceiros_users.email
            FROM parceiros_users
            INNER JOIN parceiros
            ON parceiros.id = parceiros_users.id_parceiro
            WHERE parceiros_users.id = ?;`,
            [req.params.id_user],
            (error, result, field) => {
                conn.release(); // fecha a conexao com o banco
                if (error){return res.status(500).send({error: error}) }
                
                if (result.length === 0 ){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado Usuário com este ID: " + req.params.id_produto
                    })
                }
                
                const response = {
                    parceiro_user: {
                        id_user: result[0].id_user,
                        id_parceiro: result[0].id_parceiro,
                        parceiro: result[0].parceiro,
                        nome: result[0].nome,
                        email: result[0].email,
                        password: result[0].password,             
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos Usuários',
                            url: 'http://localhost:3000/parceiros_users'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )

    });  
};

exports.atualizaParceirosUserController = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({error: error});
        }

        bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
            if(errBcrypt){ return res.status(500).send({ error: errBcrypt})}

            conn.query(
                `UPDATE parceiros_users
                    SET nome          =   ?,
                        email         =   ?,
                        password      =   ?
                WHERE  parceiros_users.id_parceiro = ? 
                    AND  parceiros_users.id = ?;`,
                [   req.body.nome, 
                    req.body.email,
                    hash, 
                    req.body.id_parceiro, 
                    req.body.id_user
                ],
                (error, result, field) => {                    
                    conn.release(); // fecha a conexao com o banco
                    if (error){return res.status(500).send({error: error}) }
                    if (result.affectedRows === 0 ){
                        return res.status(404).send({
                            mensagem: "Não foi encontrado Usuário com este ID: " + req.body.id_user
                        })
                    }
                    const response = {
                        mensagem: "Usuário Atualizado com sucesso!",
                        parceirosUserAtualizado: {
                            id_user : req.body.id_user,
                            nome: req.body.nome,                         
                            email: req.body.email,   
                            password: req.body.password,                 
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna dados do Usuário Atualizado',
                                url: 'http://localhost:3000/parceiros_users/' + req.body.id_user
                            }
                        }
                    }
                    return res.status(202).send(response);
                }
            )
        });
    });
};

exports.excluirParceiroUserController =  (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE parceiros_users
                SET excluido                    =   1
            WHERE  parceiros_users.id_parceiro  = ? 
                AND  parceiros_users.id         = ?
                AND excluido                    =   0;`,
            [   
                req.body.id_parceiro, 
                req.body.id_user
            ],
            (error, result, field) => {
                conn.release(); // fecha a conexao com o banco
                if (error){return res.status(500).send({error: error}) }                
                if (result.affectedRows === 0 ){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado Usuário com este ID: " + req.body.id_user
                    })
                }
                const response = {
                    mensagem: "Usuário Excluido com sucesso!",
                    userExcluido: {
                        id_user: req.body.id_user,  
                        id_parceiro: req.body.id_parceiro,               
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna dados do Usuários',
                            url: process.env.URL_API + '/parceiros_users'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )

    });
};