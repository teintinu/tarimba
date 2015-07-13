import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import mui from 'material-ui'

import H from '../../libs/h5mobile/h5frontend.js';
var test;

var {
    LinearProgress
} = mui;

class AppTitleView extends FluxEasy.View {

    constructor() {
        zscanapp.addEventListener('RefreshTitle', this);
        zscanapp.addEventListener('RefreshTasks', this);
        this.state.createSearch = true;
        this.state.activeSearch = false;
        this.state.searchText = '';
    }
    atualizaTitle() {
        zscanapp.setTitle("Zscan");
    }
    render() {
        var tasks = zscanapp.tasks();
        var altTask = tasks.length ? tasks[0].title : null;
        var classIcon = 'fa fa-cog gira';
        var styleIcon = {
            color: 'white',
            fontSize: '20px'
        }
        var styleDivIcon = {
            float: 'right',
            marginRight: '5px',
            marginTop: '20px',
            marginRigth: '10px',
            position: 'absolute'
        }

        var styleSearch = {
            color: 'white',
            right: '25px',
            top: '20px',
            fontSize: '18px',
            position: 'absolute'
        }

        var styleLinerProgress = {
            position: 'absolute',
            marginTop: '60px',
            left: '0px'
        }

        var classSearch = (tasks.length && this.state.searchText != '') ? 'searching fa fa-search' : 'fa fa-search';
        return ( <H.AppTitle onLeftIconButtonTouchTap = {this.props.openMenu} showMenuIconButton = {window.innerWidth < 750}
              titleText = {
                  {
                      pt_br: "Zscan - pt_br",
                      en: "Zscan - en",
                     es: "Zscan - es"
                   }
               }>

                    <H.Icon onClick={this.appSearch.bind(this, "iconSearch")}
                            style={styleSearch}
                            iconClassName={classSearch}
                            title={altTask}/>
                    {this.state.activeSearch ?
                    <input ref="search"
                           className='hInputSearch'
                           hintText="Search"
                           valueLink={this.state.searchText}
                           onKeyUp={this.pesquisa}
                           onBlur={this.fechaSearch} /> : null}

                    {tasks.length ? <div style = {styleDivIcon}>
                   < H.Icon onClick={this.appTaskClick}
                            style = {styleIcon}
                            iconClassName = {classIcon}
                            title = {altTask}/></div > : ""}
               {tasks.length ? < LinearProgress style = {styleLinerProgress} /> : ""}
            < /H.AppTitle>
        );
    }

    pesquisa() {
        zscanapp.setPesquisa(this.state.searchText);
    }

    appSearch() {
        var self = this;
        this.setState({
            searchText: "",
            createSearch: false,
            activeSearch: !this.state.activeSearch,
        });
         setTimeout(function(){
            React.findDOMNode(self.refs.search).focus();
         }, 0);
    }

    fechaSearch(e) {
        if (this.state.activeSearch) {
            setTimeout(function () {
                this.setState({
                    searchText: "",
                    createSearch: false,
                    activeSearch: false
                });
            }.bind(this), 100);
        }
    }

    appTaskClick() {
        if (!test) {
            test = {
                title: "Task OK"
            };
            this.app.taskBegin(test);
        } else {
            this.app.taskEnd(test);
            test = null;
        }
    }
}

export default AppTitleView;

