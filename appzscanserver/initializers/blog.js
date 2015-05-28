module.exports = {
  loadPriority:  1000,
  startPriority: 1000,
  stopPriority:  1000,
  initialize: function(api, next){
    api.blog = {};

    next();
  },
  start: function(api, next){
    next();
  },
  stop: function(api, next){
    next();
  }
};
