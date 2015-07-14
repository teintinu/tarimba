===============================================
header          css #header .middle-wrapper
header-icon     css #header-logo
header-text     css #header h1
menu            css #menu .middle-wrapper
content         css #content
login           css button.btn-primary
cancel          css button.button-cancel
username        css input[name='login.username']
password        css input[name='login.password']

===============================================
 
header
    width: 900px
    height: ~ 69px
    centered horizontally inside: screen 1px
 
header-icon
    width: 48px
    height: 48px
    inside: header 0px left, 5 to 15px top bottom
 
header-text
    inside: header 5 to 22px top bottom
    near: header-icon 15 to 30px right
 
menu
    aligned vertically all: header
    below: header 0 to 1px
    height: ~ 64px
 
content
    aligned vertically all: menu
    below: menu 0 to 1px
      
username
  inside: content
  above: password

password
  inside: content
  above: login

login
    inside: content
  
cancel
    inside: content
    