module.exports = function (app) {
    require('./apptask_userLogado.less');
    var login_store=require('../contents/app/login/stores/store');

    var view = {
        stories: {
            estoria_apptask: require('../stores/apptask')
        },
        render: function () {
            var obj = login_store.whoOnline();
            return <h3 className = {obj.user?"online":"offline"}>{obj.user?obj.user:""}</h3>
        },
    };
    return view;
};
