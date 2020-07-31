API de Integração
URL_BASE: http://localhost:3000


Criar Parceiro / Filial:
TIPO: POST
HEAD: <vazio>
URL: <URL_BASE>/parceiros
BODY:   {   "nome"      : "string",
            "apelido"   : "string",
            "email"     : "string",
            "filial"    : "string"
         }
RETORNO: 	{
                "mensagem": "Parceiro inserido com Sucesso!",
                "parceiroCriado": {
                    "id": 58,
                    "nome": "string",
                    "apelido": "str",
                    "email": "string@gmail.com",
                    "filialCriado": {
                        "id": 21,
                        "filial": "string 01",
                        "key": "k - string 01"
                    },
                    "request": {
                        "tipo": "GET",
                        "descricao": "Retorna todos os parceiros",
                        "url": "http://localhost:3000/parceiros"
                    }
                }
            }

Listar Parceiros / Filiais:
TIPO: GET
HEAD: <vazio>
URL: <URL_BASE>/parceiros
BODY:  <vazia>
RETORNO: 	{   
                "response": 
                {
                    "quantidade": 3,
                    "parceiros": [
                        {
                            "id_parceiro": 54,
                            "nome": "Pizza Show",
                            "apelido": "Show",
                            "email": "cazimha@gmail.com",
                            "filiais": 
                            {
                                "id_filial": 17,
                                "filial": "Show 01",
                                "Authentication": "Show 01"
                            },
                            "request": 
                            {
                                "tipo": "GET",
                                "descricao": "Retorna um parceiro especifico pelo ID",
                                "url": "http://localhost:3000/parceiros/54"
                            }
                        },
                }
            }


Listar Somente um Parceiro / Filiais - pelo id_Parceiro:
TIPO: GET
HEAD: <vazio>
URL: <URL_BASE>/parceiros/id_Parceiro
BODY:  <vazia>
RETORNO: 	{   
                "response": 
                {
                    "quantidade": 3,
                    "parceiros": [
                        {
                            "id_parceiro": 54,
                            "nome": "Pizza Show",
                            "apelido": "Show",
                            "email": "cazimha@gmail.com",
                            "filiais": 
                            {
                                "id_filial": 17,
                                "filial": "Show 01",
                                "Authentication": "Show 01"
                            },
                            "request": 
                            {
                                "tipo": "GET",
                                "descricao": "Retorna todos parceiros",
                                "url": "http://localhost:3000/parceiros"
                            }
                        },
                }
            }



Atualiar Parceiro:
TIPO: PATCH
HEAD: <vazio>
URL: <URL_BASE>/parceiros
BODY:   {
            "id"        :   Int,
            "nome"      :   "string",
            "apelido"   :   "string",
            "email"     :   "string"            
        }
RETORNO: 	{
                "mensagem": "Parceiro Atualizado com sucesso!",
                "produtoAtualizado": {
                    "id_produto": 57,
                    "nome": "Teste Atualiza",
                    "apelido": "teste At",
                    "email": "teste@gmail.com",
                    "request": {
                        "tipo": "GET",
                        "descricao": "Retorna dados do parceiro Atualizado",
                        "url": "http://localhost:3000/parceiros/57"
                    }
                }
            }

Deletar Parceiro:
TIPO: DELETE
HEAD: <vazio>
URL: <URL_BASE>/parceiros
BODY:   {
            "id"        :   Int      
        }
RETORNO: 	{
                "mensagem": "parceiro removido com sucesso!",
                "resquet": {
                    "tipo": "POST",
                    "descricao": "Insere um parceiro",
                    "url": "http://localhost:3000/parceiros",
                    "body": {
                        "nome": "string",
                        "apelido": "string",
                        "email": "string"
                    }
                }
            }