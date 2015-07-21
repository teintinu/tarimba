===============================
body        xpath   /html/body
h1          css     h1[name="title"]
Menu        css     div[name="menu"] span span
Conteudo    css     div[name="conteudo"] div
===============================

body:
  contains: h1
  
h1:
  text is: App Store
  
Menu:
  text is: View 2
  
Conteudo:
  text is: Welcome