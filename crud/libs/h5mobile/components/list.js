var mui = require('material-ui');

var React = require('react');
var Icon = require('./icon');
var Select = require('./select');
var DropDownIcon = require('./dropDownIcon');
var h5mixinprops = require('../mixins/h5mixinprops');
var h5dropdown = require('../mixins/h5dropdown');
var Colors = mui.Styles.Colors;

var listKey = 0;

var HList = React.createClass({
    propTypes: {
        text: React.PropTypes.func.isRequired,
        actionEdit: React.PropTypes.func.isRequired,
        actionDelete: React.PropTypes.func.isRequired,
        itensList: React.PropTypes.array.isRequired,
        detail: React.PropTypes.func,
        notIconMenu: React.PropTypes.bool,
        avatarStyle: React.PropTypes.object
    },
    mixins: [h5mixinprops, h5dropdown],
    getInitialState: function(){
        return {
            listInOrder: []
        }
    },
    render: function () {

        if (!this.props.itensList)
            return console.error("Is necessary propreyty itensList in array");

        var list = this.createList();
        var keyList = "LIST" + (++listKey);
        return (React.createElement('div', {key: keyList}, [list]));
    },
    createList: function (itensDaLista) {
        this.sortList();

        var itensList = this.createItensList();

        return itensList;
    },
    sortList: function(){
      if(!this.props.sort)
            this.state.listInOrder = this.props.itensList.sort(function(a, b){
                a = a.name.toUpperCase();
                b = b.name.toUpperCase();
                if(a<b)
                    return -1;
                if(a>b)
                    return 1;
                return 0;
        });
        else if(typeof this.props.sort === 'function'){
            this.state.listInOrder= this.props.sort(this.props.itensList);
        }
    },
    defineProperties: function (item, index, arr) {

        var propsItemList = {};

        if(!this.props.noAvatar){
            var avatar = this.createAvatar(item, index, arr);

            if (avatar)
                propsItemList.leftAvatar = avatar;
            else
                propsItemList.insetChildren = true;
        }


        if (this.props.detail) {
            var conteudoSecundary;
            if (typeof this.props.detail === 'function')
                conteudoSecundary = this.props.detail(item);
            else
                conteudoSecundary = this.props.detail;

            if(conteudoSecundary != null){
              propsItemList.secondaryText = conteudoSecundary;
            }
        }

        propsItemList.onTouchTap = this._click.bind(this, item);


        return propsItemList;
    },
    createItensList: function(){
        var self = this;
        return this.state.listInOrder.map(function (item, index, arr) {

            var propsItemList = self.defineProperties(item, index, arr);

            if(!self.props.notIconMenu)
                var iconList = self.criaIcon(index, arr);
            var conteudo;
            if(typeof item.conteudo === 'function')
                conteudo = item.conteudo()
            else
                conteudo = item.conteudo;
            var keyDiv = "DIV1" + (++listKey);

            propsItemList.key = "IL" + (++listKey)
            propsItemList.style = {
                marginBottom: '0px !important',
                height: '52px',
                padding: '10px',
                width: '100%'
            }
            var propsDivItem = {};
            propsDivItem.className= 'itemMenuList';
            propsDivItem.key= keyDiv;

            return React.createElement("div", propsDivItem, [iconList,
                React.createElement('table', propsItemList, [
                    React.createElement('td', {style: {
                        height: '40px',
                        position: 'relative'
                    }}, [propsItemList.leftAvatar,
                        React.createElement('span', {style:{
                            left: '52px',
                            position: 'absolute',
                            top: '10px'
                        }}, self.props.text(item))
                   ])
               ])
           ]);
        });
    },
    createAvatar: function (item, index, arr) {
        var keyAvatar = "AV" + (++listKey);
        if(item.name && !item.avatar)
            var letra = this.defineLetterAvatar(item.name, index, arr);
        else if(item.avatar)
            var src = item.avatar;

        if (letra != "")
           return React.createElement(mui.Avatar, {key: keyAvatar, style:this.props.avatarStyle?this.props.avatarStyle:{}, src: src}, src != undefined ? '' : letra);
        return false;
    },
    defineLetterAvatar: function(text, index, arr){
        var letraPalavraAtual = text.substr(0, 1).toUpperCase();
        var letra;
        if (index != 0 && arr[index - 1].avatar == undefined)
            letra = arr[index - 1].name.substr(0, 1).toUpperCase() == letraPalavraAtual ? "" : letraPalavraAtual;
        else
            letra = letraPalavraAtual;
        return letra;
    },
    criaIcon: function (indexItens, arrayItens){
        var style;
        if(this.props.style)
            style = this.props.style;
        var menuDropDownItens = [
          {text: 'Editar', action: this.props.actionEdit},
          {text: 'Excluir', action: this.props.actionDelete}
        ];

        var styleIconMenu = {
            position: 'absolute',
            cursor: 'pointer',
            right: '10px',
            zIndex: '2',
            top: '6px',
            fontSize: '21px',
            padding: '13px'
        }

        var keyDropDownIcon = "DDI" + (++listKey);
        var keyDIV = "DIV2" + (++listKey);
        var self = this;
        return(

            <div key={keyDIV} style={{position:'relative'}}>
                <Icon
                     key={keyDropDownIcon}
                     indexItens={indexItens}
                     arrayItens={arrayItens}
                     onItemClick={this._changeItens}
                     className = {!this.props.iconClassName ? "fa fa-ellipsis-v" : this.props.iconClassName}
                     style={styleIconMenu}
                    menuDropDownItens = {menuDropDownItens}
                />
            </div>
        )
    },
    _click: function(item){
        this.props.actionEdit(item);
    },
    _changeItens: function(index, array, e, selectedIndex, menuItem){
        menuItem.action(array[index]);
    }
});

module.exports = HList;
