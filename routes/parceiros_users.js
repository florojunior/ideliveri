const express = require('express');
const router = express.Router();

const Parceiros_Users_Controller = require('../controllers/parceiros_users-controller');

//insere um Usuário
router.post('/', Parceiros_Users_Controller.adicionaParceirosUrser);
//Login do Parceiro
router.post('/login', Parceiros_Users_Controller.loginParceiroUserController);
//Lista todos Usuários
router.get('/', Parceiros_Users_Controller.listasParceirosUsersController);
//lista um unico Usuário id
router.get('/:id_user', Parceiros_Users_Controller.listasParceirosUsersIdController );
//altera um Usuário
router.patch('/', Parceiros_Users_Controller.atualizaParceirosUserController);
//deleta um parceiro
router.delete('/', Parceiros_Users_Controller.excluirParceiroUserController);

module.exports = router;