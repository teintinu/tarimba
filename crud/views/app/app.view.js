import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import AppTitle from './apptitle.view.jsx';
import Content from './content.js';
import less from '../../style.less';
import mui from 'material-ui';

import H from '../../libs/h5mobile/h5frontend.js';

var ThemeManager = new mui.Styles.ThemeManager();

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

class AppView extends FluxEasy.View {

    constructor() {
        AppView.app = AppStore.createStoreReference(dispatcher);
        AppView.title = AppTitle.createViewReference(dispatcher);

        AppView.content = Content.createViewReference(dispatcher);
        this.app.addEventListener('RefreshAll', this);
        zscanapp.addEventListener('RefreshTasks', this);

        AppView.childContextTypes = {
            muiTheme: React.PropTypes.object,
            hsession: React.PropTypes.object
        };
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }

    render() {
        var tasks = zscanapp.tasks();
        var state = this.app.getState();
        var styleIcon = {
          position: 'fixed',
          color: 'black',
          fontSize: '40px',
          zIndex: '100',
          top: '48%',
          left: '44%'
        }
        var styleDivIcon = {
            position: 'relative'
        }
        return (React.createElement('div', {}, [
                React.createElement(this.title.Class, {openMenu: this.toggle}),
                <div>
                {window.innerWidth > 750 ?
                     <H.MenuLeft ref="menu" docked={true} menuItems={this.app.getState().menuItems} onClick={this.onItemClick} /> :
                      <H.MenuLeft ref="menu" refMenu="leftMenu" docked={window.innerWidth > 750} menuItems={this.app.getState().menuItems} onClick={this.onItemClick} />
                 }
                </div>,
                React.createElement(this.content.Class),


                <div style = {styleDivIcon}>
                {tasks.length > 0 ?
                 <H.Icon onClick={this.appTaskClick}
                    style = {styleIcon}
                    iconClassName = 'fa fa-cog gira'/>: null}</div>
        ]));
    }
    toggle(){
        this.refs.menu.toggle();
    }
    onItemClick (e, index, menuItem) {
        this.app.setClickItem(index);
        this.app.setContent({hash: menuItem.name, keepSubRoute: true});
    }
    _getSelectedIndex(){
        this.app.getState().menuSelecionado;
    }
}


export default AppView;
