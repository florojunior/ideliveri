const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


//insere um Parceiro
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({error: error}) }
        conn.query(
            'INSERT INTO parceiros (nome, apelido, email) VALUES (?,?,?)',
            [req.body.nome, req.body.apelido, req.body.email],
            (error, result, field) => {
                if (error){return res.status(500).send({error: error}) }
                
                conn.query(
                    'INSERT INTO parceiros_filiais (id_parceiro, filial, Authentication) VALUES (?,?,?)',
                    [result.insertId, req.body.filial, req.body.filial],
                    (error, resultFilial, field) => {
                        if (error){return res.status(500).send({error: error}) }
                      
                        conn.release(); // fecha a conexao com o banco
                        const response = {
                            mensagem: "Parceiro inserido com Sucesso!",
                            parceiroCriado: {
                                id : result.insertId,
                                nome: req.body.nome,
                                apelido: req.body.apelido, 
                                email: req.body.email,
                                filialCriado:{
                                    id: resultFilial.insertId,
                                    filial: req.body.filial,
                                    key: "k - " + req.body.filial,    
                                },
                                                                    
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os parceiros',
                                    url: 'http://localhost:3000/parceiros'
                                }
                            }
                        }
                        return res.status(201).send(response);
                    }
                )
               
            }
        )
    });
});


//Lista todos parceiros
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({ error: error}) }
        conn.query(
            `SELECT 
                parceiros.id as id_parceiro,
                parceiros.nome,
                parceiros.apelido,
                parceiros.email,
                parceiros_filiais.id as id_filial,
                parceiros_filiais.filial,
                parceiros_filiais.Authentication
            FROM parceiros
            INNER JOIN parceiros_filiais
            ON parceiros_filiais.id_parceiro = parceiros.id;`,

            (error, result, field) => {
                conn.release(); // fecha a conexao com o banco
                if (error){ return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    parceiros: result.map(parceiro => {
                        return{
                            id_parceiro: parceiro.id_parceiro,
                            nome: parceiro.nome,
                            apelido: parceiro.apelido,
                            email: parceiro.email,
                            filiais:{
                                id_filial: parceiro.id_filial,
                                filial: parceiro.filial,
                                Authentication: parceiro.Authentication,
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um parceiro especifico pelo ID',
                                url: 'http://localhost:3000/parceiros/' + parceiro.id_parceiro
                            }
                        }
                    })

                }
                 return res.status(200).send({ response: response})                
            }
        )

    });
});

//lista um unico parceiro id
router.get('/:id_parceiro', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({ error: error}) }
        conn.query(           
            `SELECT 
                parceiros.id as id_parceiro,
                parceiros.nome,
                parceiros.apelido,
                parceiros.email,
                parceiros_filiais.id as id_filial,
                parceiros_filiais.filial,
                parceiros_filiais.Authentication
            FROM parceiros
            INNER JOIN parceiros_filiais
            ON parceiros_filiais.id_parceiro = parceiros.id
            WHERE parceiros.id = ?;`,
            [req.params.id_parceiro],
            (error, result, field) => {
                conn.release(); // fecha a conexao com o banco
                if (error){return res.status(500).send({error: error}) }
                
                if (result.length === 0 ){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado parceiro com este ID: " + req.params.id_produto
                    })
                }
                
                const response = {
                        parceiro: {
                        id_parceiro : result[0].id_parceiro,
                        nome: result[0].nome,
                        apelido: result[0].apelido, 
                        email: result[0].email,  
                        filiais:{
                            id_filial: result[0].id_filial,
                            filial: result[0].filial,
                            Authentication: result[0].Authentication,
                        },                  
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos parceiros',
                            url: 'http://localhost:3000/parceiros'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )

    });  
});



//altera um parceiro
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({error: error});
        }
        conn.query(
            `UPDATE parceiros
                SET nome            =   ?,
                    apelido         =   ?,
                    email           =   ?
               WHERE id             =   ?`,
            [   req.body.nome, 
                req.body.apelido,
                req.body.email,  
                req.body.id
            ],
            (error, result, field) => {
                if (error){return res.status(500).send({error: error}) }
                conn.release(); // fecha a conexao com o banco
                if (result.affectedRows === 0 ){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado parceiro com este ID: " + req.body.id_produto
                    })
                }
                const response = {
                    mensagem: "Parceiro Atualizado com sucesso!",
                    produtoAtualizado: {
                        id_produto : req.body.id,
                        nome: req.body.nome,
                        apelido: req.body.apelido,  
                        email: req.body.email,                   
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna dados do parceiro Atualizado',
                            url: 'http://localhost:3000/parceiros/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )

    });
});

//deleta um parceiro
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){return res.status(500).send({error: error })}
        conn.query(
            `DELETE FROM parceiros WHERE ID =   ?`, [req.body.id],
            (error, result, field) => {
                conn.release(); // fecha a conexao com o banco
                if (error){return res.status(500).send({error: error }) }
                if (result.affectedRows === 0 ){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado parceiro com este ID: " + req.body.id
                    })
                }
                const response = {
                    mensagem: 'parceiro removido com sucesso!',
                    resquet:{
                        tipo: "POST",
                        descricao: "Insere um parceiro",
                        url: 'http://localhost:3000/parceiros',
                        body: {
                            nome: 'string',
                            apelido: 'string',
                            email: 'string'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});


module.exports = router;