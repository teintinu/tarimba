=======================================
label       xpath   //*[@id="wrap"]/label[2]/span
name        css     input[name="name"]
body        xpath   /html/body
btn         id      btn
=======================================

body:
  contains: name
  contains: btn
  contains: label
  
name: 
  text is: 
  above: btn
  
btn
  text is: Button
  
label
  text is: required