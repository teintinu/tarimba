module.exports = function (app) {
    require('./apptask_userLogado.less');
    var login_store=require('../contents/app/login/stores/store');

    var view = {
        stories: {
            login_store: login_store
        },
        render: function () {
            var obj = login_store.whoOnline;
            return <div onClick={this.doubleClick}><h3 className = {obj?"online":"offline"}>{obj?obj.user:""}</h3></div>
        },
        doubleClick: function(){

        }
    };

    return view;
};
