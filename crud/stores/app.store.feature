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
  E this.state.openned_processes[processName] == {reference: mod.createStoreReference(dispatcher), subroute: subroute}
  E this.state.lasthash != hash é executa a função this.state.openned_processes[processName].reference.route(subroute)
  E this.state.curr_process == {process: processInfo.reference, processName: processName, subroute: subroute, task: processInfo.reference.getState().task}
  E é executado um this.emit('RefreshContent')

  Dado que o usuário tenha um processo iniciado
  Quando ocorrer um hashchange
  E this.state.openned_processes[processName] tiver valor
  Então this.state.lasthash == hash
  E processInfo == this.state.openned_processes[processName]
  E this.state.lasthash != hash é executa a função this.state.openned_processes[processName].reference.route(subroute)
  E this.state.curr_process == {process: processInfo.reference, processName: processName, subroute: subroute, task: processInfo.reference.getState().task}
  E é executado um this.emit('RefreshContent')



Cenário: idioma Inicial / de acordo com o navegador
  Dado que não tem nenhum cookie instalado no navegador que está acessado a aplicação
  Quando o usuário acessar utilizando esse navegador
  Então a aplicação deve identificar a linguagem padrão do navegador
  E atribuir window.hsession.language

Cenário: Tela inicial abri o crud o botão voltar tem que voltar para tela inicial / se eu abertar o botão de ir para frente deve ir para o crud


#Cenário: idioma / cookie
#Cenário: idioma Inicial / de acordo com o navegador
#Cenário: Logado / não logado
