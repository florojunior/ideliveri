const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//insere um Pedido
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){return res.status(500).send({error: error })}
        conn.query('SELECT * FROM Produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, field) => {
                if (error){return res.status(500).send({error: error}) }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: "Produto não encontrado"
                    })
                }
            conn.query(
                'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                [req.body.id_produto, req.body.quantidade],
                (error, result, field) => {
                    conn.release(); // fecha a conexao com o banco
                    if (error){return res.status(500).send({error: error}) }
                    const response = {
                        mensagem: "Pedido inserido com sucesso!",
                        produtoCriado: {
                            id_produto : req.body.id_produto,
                            nome: req.body.nome,
                            preco: req.body.preco,                    
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os Pedidos',
                                url: 'http://localhost:3000/Pedidos'
                            }
                        }
                    }
                    return res.status(201).send(response);
                }
            )
        });
    });
});

//Lista todos Pedidos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){ return res.status(500).send({ error: error}) }
        conn.query(
            `SELECT pedidos.id_pedido,
                    pedidos.quantidade,                    
                    pedidos.id_produto,
                    produtos.nome,
                    produtos.preco
                FROM pedidos
            INNER JOIN produtos
                ON produtos.id_produto = pedidos.id_produto;`,
        (error, result, field) => {
            conn.release(); // fecha a conexao com o banco
            if (error){ return res.status(500).send({ error: error})}
            const response = {
                qtde_pedidos: result.length,
                pedidos: result.map(pedido => {
                    return{
                        id_pedido: pedido.id_pedido,
                        quantidade: pedido.quantidade,
                        produto: {
                            id_produto: pedido.id_produto,
                            nome: pedido.nome,
                            preco: pedido.preco,
                        },
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um Pedido especifico pelo ID',
                            url: 'http://localhost:3000/pedido/' + pedido.id_pedido
                        }
                    }
                })
        }
                 return res.status(200).send({ response: response})                
            }
        )
    });
});


//listaum unico Pedido id
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido

    if (id === 'especial'){
        res.status(200).send({
            mensagem: "Voce passou um ID pedido especial",
            id: id
        });
    }else{
        res.status(200).send({
            mensagem: "Voce passou um ID do Pedido"
        });
    }   
});


//altera um pedido
router.patch('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Usando o Patch dentro da Rota de Pedido"
    });
});

//deleta um Pedido
router.delete('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Deleta um  Pedido"
    });
});
module.exports = router;