Funcionalidade: Store para controlar os processos ativos/abertos na aplicação
  Para permitir o usuário utilizar a aplicação
  Eu, como programador
  Desejo utilizar o app.store


#Cenário: Login
#  Dado que é necessário a identificação do usuário da aplicação
#  Quando this.state.login == null
#  Então redirecionar para a view de login

Cenário: Estado inicial / Tela de Bemvindo
  Dado que é necessário um conteudo
  Quando não souber o que renderizar
  Então this.state.curr_process == welcome

Cenário: Menu do sistema
  Dado que o sistema oferece muitas opções
  Quando eu quiser disponibilizar uma opção para o usuário
  Então eu devo acrescentar ela em this.state.menuItems

Cenário: Abrir um processo
  Dado que o usuário iniciou um processo
  Quando ocorrer um hashchange
  Então this.state.lasthash = hash
  E é percorrido o this.state.menuItems
  E processModule == menuItem.module
  E o processModule é executado recebendo do callback o mod
  E this.state.openned_processes[processName] == reference= mod.createStoreReference(dispatcher), subroute= subroute}
  E this.state.lasthash != hash é executa a função this.state.openned_processes[processName].reference.route(subroute)
  E this.state.curr_process == {process=processInfo.reference, processName=processName, subroute=subroute, task=processInfo.reference.getState().task}
  E é executado um this.emit('RefreshContent')

  Dado que o usuário tenha um processo iniciado
  Quando ocorrer um hashchange
  E this.state.openned_processes[processName] tiver valor
  Então this.state.lasthash == hash
  E processInfo == this.state.openned_processes[processName]
  E this.state.lasthash != hash é executa a função this.state.openned_processes[processName].reference.route(subroute)
  E this.state.curr_process == {process=processInfo.reference, processName=processName, subroute=subroute, task=processInfo.reference.getState().task}
  E é executado um this.emit('RefreshContent')

Cenário: Idioma inicial de acordo com o navegador
  Dado que não tem nenhum cookie instalado no navegador que está acessado a aplicação
  Quando o usuário acessar utilizando esse navegador
  Então a aplicação deve identificar a linguagem padrão do navegador
  E atribuir window.hsession.language

  Cenário: Back and forward de processos no navegador
  Dado que o usuário está na tela inicial
  E clicar no menu para ir para o processo crud
  Quando ele clicar em voltar no navegador
  Então a aplicação deverá exibir a tela inicial

  Dado que o usuário está na tela inicial
  E clicar no menu para ir para o processo crud
  E clicar em voltar no navegador
  Quando ele clicar em ir para frente no navegador
  Então a aplicação deverá exibir a tela do crud


  #Cenário: idioma / cookie

    case              | campo | spec_input_sem_foco | spec_input_com_foco | spec_input_onBlur
    ----------------------------------------------------------------------------------------------
    campo obrigatorio | c1    | spanErro            | spanErro            | spanErro
      nao preenchido  |       |   text is:          |   text is:          |   text is: Obrigatorio
                      |       |   below: input      |   below: input      |   below: input
                      |       |                     |                     |   color: red
    ----------------------------------------------------------------------------------------------
