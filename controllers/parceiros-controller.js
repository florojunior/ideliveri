const mysql = require('../mysql');
// const express = require('express');

// exports.listaParceiroId = async(req, res, next) => {
//      try {
//         const query = 'digite suaquery';
//         const result = await mysql.execute(query)


//         return res.status(200).send({ response }); 
//      } catch (error) {
//         return res.status(500).send({ error: error});  
//      }    
// };

exports.listaParceiros = async(req, res, next) => {
try {
    const result = await mysql.execute(`SELECT 
                                        parceiros.id as id_parceiro,
                                        parceiros.nome,
                                        parceiros.apelido,
                                        parceiros.email,
                                        parceiros_filiais.id as id_filial,
                                        parceiros_filiais.filial,
                                        parceiros_filiais.token,
                                        parceiros_filiais.logo
                                    FROM parceiros
                                    INNER JOIN parceiros_filiais
                                    ON parceiros_filiais.id_parceiro = parceiros.id;`)
        
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
                    token: parceiro.token,
                    logo: parceiro.logo,
                },
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna um parceiro especifico pelo ID',
                    url: process.env.URL_API + 'parceiros/' + parceiro.id_parceiro
                }
            }
        })

        }
        return res.status(200).send({ response: response}) 
    } catch (error) {
        return res.status(500).send({ error: error}); 
    }

};


exports.adicionaParceiro = async(req, res, next) => {
     try {
        const query = 'INSERT INTO parceiros (nome, apelido, email) VALUES (?,?,?)';
        const result = await mysql.execute(query,
            [req.body.nome, req.body.apelido, req.body.email])
            console.log(result);
        const queryFiliais = 'INSERT INTO parceiros_filiais (id_parceiro, filial, token, logo) VALUES (?,?,?,?)';
        const resultFilial = await mysql.execute(queryFiliais,
            [result.insertId, req.body.filial, req.body.filial, req.file.path])
            console.log(resultFilial);
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
                    logo: req.file.path,  
                },
                                                    
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os parceiros',
                    url: 'http://localhost:3000/parceiros'
                }
            }
        }

        return res.status(200).send({ response }); 
     } catch (error) {
        return res.status(500).send({ error: error});  
     }    
};

// exports.adicionaParceiro = (req, res, next) => {
//     console.log(req.file );
//     mysql.getConnection((error, conn) => {
//         if (error){
//             return res.status(500).send({error: error}) }
//         conn.query(
//             'INSERT INTO parceiros (nome, apelido, email) VALUES (?,?,?)',
//             [req.body.nome, req.body.apelido, req.body.email],
//             (error, result, field) => {
//                 conn.release(); // fecha a conexao com o banco
//                 if (error){return res.status(500).send({error: error}) }
                
//                 conn.query(
//                     'INSERT INTO parceiros_filiais (id_parceiro, filial, token, logo) VALUES (?,?,?,?)',
//                     [result.insertId, req.body.filial, req.body.filial, req.file.path],
//                     (error, resultFilial, field) => {
//                         conn.release(); // fecha a conexao com o banco
//                         if (error){return res.status(500).send({error: error}) }
//                         const response = {
//                             mensagem: "Parceiro inserido com Sucesso!",
//                             parceiroCriado: {
//                                 id : result.insertId,
//                                 nome: req.body.nome,
//                                 apelido: req.body.apelido, 
//                                 email: req.body.email,
//                                 filialCriado:{
//                                     id: resultFilial.insertId,
//                                     filial: req.body.filial,
//                                     key: "k - " + req.body.filial, 
//                                     logo: req.file.path,  
//                                 },
                                                                    
//                                 request: {
//                                     tipo: 'GET',
//                                     descricao: 'Retorna todos os parceiros',
//                                     url: 'http://localhost:3000/parceiros'
//                                 }
//                             }
//                         }
//                         return res.status(201).send(response);
//                     }
//                 )
               
//             }
//         )
//     });
// };

exports.listaParceiroId = async(req, res, next) => {
     try {
        const query = `SELECT 
                            parceiros.id as id_parceiro,
                            parceiros.nome,
                            parceiros.apelido,
                            parceiros.email,
                            parceiros_filiais.id as id_filial,
                            parceiros_filiais.filial,
                            parceiros_filiais.token,
                            parceiros_filiais.logo
                        FROM parceiros
                        INNER JOIN parceiros_filiais
                        ON parceiros_filiais.id_parceiro = parceiros.id
                        WHERE parceiros.id = ?;`;
        const result = await mysql.execute(query,
                            [req.params.id_parceiro]);

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
                        token: result[0].token,
                        logo: result[0].logo,
                    },                  
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos parceiros',
                        url: 'http://localhost:3000/parceiros'
                    }
                }
            }
        return res.status(200).send({ response }); 
     } catch (error) {
        return res.status(500).send({ error: error});  
     }    
};


exports.atualizaParceiro = (req, res, next) => {
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
                conn.release(); // fecha a conexao com o banco
                if (error){return res.status(500).send({error: error}) }
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
}

exports.deletaParceiro = (req, res, next) => {
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
}