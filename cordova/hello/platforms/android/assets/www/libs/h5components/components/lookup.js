var mui = require('material-ui');
var ClickAwayable = mui.Mixins.ClickAwayable;
var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');
var Icon = require('./icon');
var Transitions = mui.Styles.Transitions;

var zIndex= 100;
var Lookup = React.createClass({
    mixins: [ClickAwayable],
    propTypes: {
        store: React.PropTypes.object.isRequired,
        floatingLabelText: React.PropTypes.string.isRequired,
        hintText: React.PropTypes.string.isRequired,
        query: React.PropTypes.string.isRequired,
        field: React.PropTypes.string.isRequired,
        validations: React.PropTypes.array,
        notFoundText: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            open: false,
            tmSearch: null,
            _searching: false,
            searchingText: null,
            searchResult: [],
            searchResultIndex: -1,
            lookupDataBackup: {},
            zIndex: --zIndex
        }
    },
    render: function () {
        var self = this;

        if (!this.props.store)
            return console.error("Is necessary propreyty store in input");

        var state = this.props.store.getState();
        var lookupdata = state.editing[this.props.field] ? state.editing[this.props.field] : "";
        var error = state.editing_errors[this.props.field];

        if(this.props.validations){
            var required = this.props.validations.some(function(v){
                if(v)
                    return v.name == 'required';
            });
        }


        if(!Object.keys(this.state.lookupDataBackup).length){
            this.state.lookupDataBackup.display = lookupdata.display;
            this.state.lookupDataBackup._id = lookupdata._id;
        }

        //Props TD
        var p = /(\d+)/.exec(this.props.className);
        var colspanx = p[1];

        var propstd = {
            colSpan: colspanx
        };

        if (this.props.rowSpan)
            propstd.rowSpan = this.props.rowSpan;


        var notFoundText = this.props.notFoundText ? this.props.notFoundText : 'Nenhum resultado encontrado';

        var propsTextField = {};

        propsTextField.fullWidth = true;
        propsTextField.value = lookupdata.display != '' ? lookupdata.display : null;
        propsTextField.errorText = error ? error : ''
        propsTextField.name = this.props.field;
        propsTextField.floatingLabelText = required ?  "* " + this.props.floatingLabelText  : this.props.floatingLabelText;
        propsTextField.hintText = this.props.hintText;
        propsTextField.onChange = this.changed;
        propsTextField.onKeyUp = this.keyUp;
        propsTextField.onKeyDown = this.keyDown;
        propsTextField.ref = this.props.field;
        propsTextField.className = this.props.iconAlign ? 'input' + this.props.iconAlign : 'inputleft'



        var propsIcon = {}

        propsIcon.onClick = this.searchLupa.bind(this, '');
        propsIcon.onItemTap = this.searchLupa.bind(this, '');
        propsIcon.iconClassName = this.state._searching ? 'fa fa-search searching' : 'fa fa-search';
        propsIcon.style = {
            left: '0px',
            fontSize: '14px',
            width: '14px',
            color: mui.Styles.Colors.grey500,
            position: 'absolute',
            bottom: '18px'
        };

        var propsIconApaga = {};
        propsIconApaga.onClick = this.clearAndSearch;
        propsIconApaga.onItemTap = this.clearAndSearch;
        propsIconApaga.iconClassName = 'fa fa-times-circle hoverRed';
        propsIconApaga.style = {
            right: '10px',
            fontSize: '14px',
            width: '10px',
            color: mui.Styles.Colors.grey500,
            position: 'absolute',
            bottom: '18px'
        };

        var classPaper = this.state.open ? 'animationDropDown' : '';
        var stylePaper = {
            maxHeight: '165px',
            overflow: 'auto',
            position: 'absolute',
            width:'100%',
            zIndex: '100',
            textAlign: (this.state.searchResult && this.state.searchResult.length > 0)  ? 'start' : 'center'
        };
        var styleDiv = {
            width: '100%',
            position: 'relative'
        };
        var styleList ={
            maxHeight: '200px',
            backgroundColor: "white"
        };

        var styleDivQueEnglobaTodoLookup ={
            position: 'absolute',
            height: '247px',
            width: 'calc(100% + 7px)',
            marginLeft: '-6px',
            boxShadow: 'rgba(0, 151, 167, 0.3) 0px 1px 6px, rgba(0, 151, 167, 0.5) 0px 1px 4px',
            backgroundColor: "white"
        };

        var listResult = this.state.searchResult ? <mui.List style={styleList} >{this.state.searchResult.length > 0 ? this.state.searchResult.map(function (item, index) {
                        var style = {
                            height: '30px',
                            lineHeight: '0px'
                        };
                        if(index == self.state.searchResultIndex){
                            style.backgroundColor = mui.Styles.Colors.grey300;
                        }
                        var propsItemList={};
                        propsItemList.onTouchTap = self._click.bind(self, index);
                        propsItemList.style=style;
                        return React.createElement(mui.ListItem, propsItemList, [item.name])
                    }) : <span style={{color: 'gray', fontFamily: 'Roboto', fontSize: '100%'}}>
                            {notFoundText}
                        </span>}</mui.List>
                    : <span className="fa fa-repeat gira"></span>


        var listLookup = this.state.open ?
            <div style={styleDiv}>
                <div ref="lookup" className={classPaper} style={stylePaper}>
                    {listResult}
                </div> </div>
                : null;

        return (React.createElement("td", propstd,
                        React.createElement("div", {style:{position: 'relative', zIndex: this.state.zIndex}},
                        [this.state.open ? React.createElement("div", {style: styleDivQueEnglobaTodoLookup}) : null,
                         React.createElement(mui.TextField, propsTextField),
                         React.createElement('div', {position: 'relative'}, React.createElement(Icon, propsIcon)),
                         listLookup,
                         this.getEditingStore()[this.props.field].display ?
                                  React.createElement('div', {position: 'relative'},
                                     React.createElement(Icon, propsIconApaga)) : null]
                        )
                    )
               );
    },

    componentClickAway: function componentClickAway() {
        this.closeDropDown();
    },
    openDropDown: function(){
       this.setState({
           open: true,
           keyUpScroll: 0
       });
    },
    closeDropDown: function(){
       this.setState({ open: false });
    },
    _click: function(index){
        this.state.searchResultIndex = index;
        this.selectItem();
    },
    scrollItemTop: function(){
      if(this.state.keyUpScroll > 1)
        this.state.keyUpScroll -= 1;
      else
        React.findDOMNode(this.refs.lookup).scrollTop -= 30;
    },
    scrollItemDown: function(){
      if(this.state.keyUpScroll < 5)
         this.state.keyUpScroll += 1;
      else
         React.findDOMNode(this.refs.lookup).scrollTop += 30;
    },
    keyDown: function(e){
        if (e.key == 'Tab') {
            this.cancelSelectItem();
        }
    },
    keyUp: function (e) {
        var self = this;
        e.preventDefault();
        if (e.key == 'ArrowUp' && !self.state._searching) {
            if(self.state.searchResultIndex > 0){
              this.scrollItemTop();
              self.state.searchResultIndex = self.state.searchResultIndex - 1;
              self.setState({});
            }
        }
        else if (e.key == 'ArrowDown'&& !self.state._searching) {
            if(self.state.searchResultIndex < self.state.searchResult.length - 1){
                this.scrollItemDown();
                self.state.searchResultIndex = self.state.searchResultIndex + 1;
                self.setState({});
            }
        }
        else if (e.key == 'Enter' && !self.state._searching) {
            this.selectItem();
        }
        else if (e.key == 'Escape') {
            this.cancelSelectItem();
        }
        else if((this.state.searchingText==null) || (this.state.searchingText.trim() != e.target.value.trim())){
            this.search(e);
        }
    },
    clearAndSearch: function(){
        this.refs[this.props.field].focus();
        var editing = this.getEditingStore();

        if(editing[this.props.field].display != this.state.lookupDataBackup.display){
            editing[this.props.field].display = this.state.lookupDataBackup.display;
            editing[this.props.field]._id = this.state.lookupDataBackup._id;
        }
        else{
            editing[this.props.field].display = '';
            editing[this.props.field]._id = null;
            this.search('');
        }
        this.setState({});
    },
    searchLupa: function(v){
        this.refs[this.props.field].focus();
        this.search(v);
    },
    search: function(v){
        var self = this;
        var valor;
        if(v.target)
            valor = v.target.value;
        else
           valor = v;

        self.setState({
                searchingText: valor
            });

            if (self.state._searching)
                scheduleSearch();
            else
                triggerSearch();

            function scheduleSearch() {
                setTimeout(function () {
                    if (self.state._searching)
                        scheduleSearch();
                    else
                        triggerSearch();
                }, 300);
            }

            function triggerSearch() {
                self.openDropDown()
                self.setState({
                    searchResult: null
                });
                if (self.state.tmSearch)
                    clearTimeout(self.state.tmSearch);
                self.state.tmSearch = setTimeout(function () {
                    self.state.tmSearch = null;
                    self.state._searching = true;
                    self.setState({});
                    self.props.lookup[self.props.query](self.state.searchingText, function (err, dados) {
                        if(self.state._searching){
                          self.setState({
                              _searching: false,
                              searchResult: dados,
                              searchResultIndex: -1
                          });
                        }
                    });

                }, 350);
            }
    },
    changed: function (ev) {
        var editing = this.getEditingStore();
        editing[this.props.field].display = ev.target.value;
        editing[this.props.field]._id = null;
        this.setState({});
    },
    validate: function(field, selected){
        var state = this.props.store.getState();
        if(state.validations && state.validations[this.props.field]){
            var editing = field;
            this.props.store.validate(this.props.field, selected.name)
        }
    },
    selectItem: function(){
        this.closeDropDown();
        var selected = this.state.searchResult[this.state.searchResultIndex];
        this.state.lookupDataBackup._id = selected._id;
        this.state.lookupDataBackup.display = selected.name;
        var editing = this.getEditingStore()
        editing[this.props.field]._id = selected._id;
        editing[this.props.field].display = selected.name;
        this.validate(editing, selected);
        this.setState({
            searchingText: null,
            searchResult: [],
            searchResultIndex: null
        });
    },
    cancelSelectItem: function(){
        this.state._searching = false;
        var editing = this.getEditingStore()
        editing[this.props.field]._id = this.state.lookupDataBackup._id;
        editing[this.props.field].display = this.state.lookupDataBackup.display;
        this.closeDropDown();
        this.setState({
            searchingText: null,
            searchResult: [],
            searchResultIndex: null
        });
    },
    getEditingStore(){
        var editing = this.props.store.getState().editing;
        if(editing[this.props.field])
           return editing;
        else{
            editing[this.props.field] = {_id: null, display:null};
           return editing;
        }
    }
});

module.exports = Lookup;
