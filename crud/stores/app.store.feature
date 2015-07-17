Funcionalidade: controlar todas as funcionalidades da aplicação
    Para permitir ao usuario alterar valores de campo
    Eu, como programador
    Desejo utilizar o componente h5-input 

Cenário: Renderização do h5.input
  Dado que o estado da estória é [estado]
  Quando eu renderizar o h5.input
  Entao validar [spec]

Exemplos: 
    estado              |  spec
    --------------------------------------------------------
    fields: {           |  input[name='campo']    
      campo: {value:''} |    text is:      
     }                  |  html/body
                        |    contains: input[name='nome']            
    ------------------------------------------------------