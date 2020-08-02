const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const storage = multer.diskStorage({    
    destination : function(req, file, cb){
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().substring(0, 10) + file.originalname);
    }
});

//Filtro para o Tipo de imagem
const fileFilter = (req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }      
}

//Filtro para o Tamanho do Arquivo da imagem
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});   

const PedidoController = require('../controllers/parceiros-controller');
//insere um Parceiro
router.post('/', upload.single('logo'), PedidoController.adicionaParceiro);
//Lista todos parceiros
router.get('/', login.obrigatorio, PedidoController.listaParceiros );
//lista um unico parceiro id
router.get('/:id_parceiro', PedidoController.listaParceiroId );
//altera um parceiro
router.patch('/', 
 PedidoController.atualizaParceiro );
//deleta um parceiro
router.delete('/', login.obrigatorio, PedidoController.deletaParceiro );


module.exports = router;