var mui = require('material-ui');
var ClickAwayable = mui.Mixins.ClickAwayable;
var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');
var h5dropdown = require('../mixins/h5dropdown');
var Icon = require('./icon');
var Input = require('./input');
var Transitions = mui.Styles.Transitions;

var zIndex= 100;
var Lookup = React.createClass({
    mixins: [h5dropdown],
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

            tmSearch: null,
            _searching: false,
            searchingText: null,
            searchResult: [],
            searchResultIndex: -1,
            lookupDataBackup: {},
            zIndex: --zIndex,
            focus: false
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
            colSpan: colspanx,
            style: {
                position: 'relative',
                height: '72px'
            }
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
        propsTextField.onFocus = this.focus;
        propsTextField.onBlur = this.blur;
        propsTextField.style = {
              position: 'relative',
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: 'rgba(0, 0, 0, 0.87)',
              font: 'inherit',
              boxSizing: 'border-box',
              paddingTop: '26px'
        };



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

        var classPaper = this.isDropDown() ? 'animationDropDown' : '';
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


        var styleLabel = {}
        styleLabel = this.state.focus || propsTextField.value || propsTextField.value == '' ?
            {
              position: 'absolute',
              lineHeight: '22px',
              opacity: '1',
              color: this.state.focus ? 'rgb(0, 188, 212)' :  'rgba(0, 0, 0, 0.298039)',
              top: '15px',
              fontSize: '14px'
        } :
            {
              position: 'absolute',
              lineHeight: '22px',
              opacity: '1',
              color: 'rgba(0, 0, 0, 0.298039)',
              top: '38px',
              left: '20px'
        };


        var listResult = this.state.searchResult ? <div style={styleList} >{this.state.searchResult.length > 0 ? this.state.searchResult.map(function (item, index) {
                        var style = {
                            height: '30px',
                            padding: '3px'
                        };
                        if(index == self.state.searchResultIndex){
                            style.backgroundColor = mui.Styles.Colors.grey300;
                        }
                        var propsItemList={};
                        propsItemList.onTouchTap = function(e){
                                    e.preventDefault();
                                    self._click(index);
                        };
                        propsItemList.style=style;
                        return React.createElement('div', propsItemList, [React.createElement('span', {style:{verticalAlign: 'middle'}}, item.name)])
                    }) : <span style={{color: 'gray', fontFamily: 'Roboto', fontSize: '100%'}}>
                            {notFoundText}
                        </span>}</div>
                    : <span className="fa fa-repeat gira"></span>


        var listLookup = this.isDropDown() ?
            <div style={styleDiv}>
                <div ref="lookup" className={classPaper} style={stylePaper}>
                    {listResult}
                </div> </div>
                : null;

        return (React.createElement("td", propstd,
                        React.createElement("div", {style:{position: 'relative', zIndex: this.state.zIndex, height: '100%'}},
                        [this.isDropDown() ? React.createElement("div", {style: styleDivQueEnglobaTodoLookup}) : null,
                         React.createElement('label', {style: styleLabel}, [
            this.state.focus || propsTextField.value || propsTextField.value == '' ? this.props.hintText : this.props.floatingLabelText]),
                         React.createElement('input', propsTextField),
                         React.createElement('hr', {style: {
                            border: 'none',
                            borderBottom: 'solid 1px #e0e0e0',
                            position: 'absolute',
                            width: '100%',
                            bottom: '8px',
                            margin: '0',
                            boxSizing: 'content-box',
                            height: '0'
                        }}),
                        this.state.focus ? React.createElement('hr', {style: {
                              borderStyle: 'none none solid',
                              borderBottomWidth: '2px',
                              position: 'absolute',
                              width: '100%',
                              bottom: '8px',
                              margin: '0px',
                              boxSizing: 'content-box',
                              height: '0px',
                              borderColor: 'rgb(0, 188, 212)',
                              transform: 'scaleX(1)'
                        }}) : null ,
                        error ?
                        React.createElement('label', {style: {
                          color: 'red',
                          fontSize: '13px',
                          bottom: '-9px',
                          position: 'absolute',
                          left: '0px'
                        }}, [error]) : null ,
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
        this.closeDropDownlookup();
    },
    openDropDownlookup: function(){
        this.openDropDown();
       this.setState({
           keyUpScroll: 0
       });
    },
    closeDropDownlookup: function(){
       this.closeDropDown();
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
                self.openDropDownlookup()
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
        this.closeDropDownlookup();
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
        this.closeDropDownlookup();
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
    },
    focus: function(e){
        this.setState({focus: true})
    },
    blur: function(e){
        var self = this;
        setTimeout(function(){
            self.closeDropDownlookup();
        }, 100);
        this.setState({focus: false})
    },
});

module.exports = Lookup;
