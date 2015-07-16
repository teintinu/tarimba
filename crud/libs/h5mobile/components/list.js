var React = require('react');
var IconDropDown = require('./icondropdown');
var Select = require('./select');
var h5mixinprops = require('../mixins/h5mixinprops');
var h5dropdown = require('../mixins/h5dropdown');
require('./style/list.less');

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
            listInOrder: [],
            clickedItem: null
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

        propsItemList.onTouchTap = this._click.bind(this, item, index);


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
            propsItemList.className = index == self.state.clickedItem ? 'h_list_ItemList h_list_ItemList_click': 'h_list_ItemList';

            var propsDivItem = {};
            propsDivItem.className ='h_itemMenuList';
            propsDivItem.key= keyDiv;

            return React.createElement("div", propsDivItem, [iconList,
                React.createElement('table', propsItemList, [
                    React.createElement('td', {className: 'h_td_ItemList'}, [propsItemList.leftAvatar,
                        React.createElement('span', {className: 'h_text_ItemList'}, self.props.text(item))
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
           return React.createElement(src == undefined ? 'span' : 'img', {key: keyAvatar, className : 'h_avatar_ItemList', src: src}, src != undefined ? '' : letra);
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

        var menuDropDownItens = [
          {text: 'Editar', action: this.props.actionEdit},
          {text: 'Excluir', action: this.props.actionDelete}
        ];

        var keyDropDownIcon = "DDI" + (++listKey);
        var keyDIV = "DIV2" + (++listKey);
        var self = this;
        return(

            <div key={keyDIV} className='h_divIcon_ItemList'>
                <IconDropDown
                     key={keyDropDownIcon}
                     indexItens={indexItens}
                     arrayItens={arrayItens}
                     onItemClick={this._changeItens}
                     className = {!this.props.iconClassName ?
                          "fa fa-ellipsis-v h_icon_ItemList" : this.props.iconClassName + ' h_icon_ItemList'}
                    menuDropDownItens = {menuDropDownItens}
                />
            </div>
        )
    },
    _click: function(item, index){
        this.setState({clickedItem: index});
        this.props.actionEdit(item);
    },
    _changeItens: function(index, array, e, selectedIndex, menuItem){
        menuItem.action(array[index]);
    }
});

module.exports = HList;
