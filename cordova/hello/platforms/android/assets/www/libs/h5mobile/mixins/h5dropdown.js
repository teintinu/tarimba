var hdropDownState = {
    current: null
};

var hdropDown = {
    toggleDropDown: function(){
        if(this.isDropDown())
            this.closeDropDown();
        else
            this.openDropDown();
    },
    openDropDown: function(){
        var old = hdropDownState.current;
        hdropDownState.current = this;
        this.setState({});
        if(old)
            old.setState({});
    },
    closeDropDown: function(){
        if(hdropDownState.current == this)
            hdropDownState.current = null;
        this.setState({});
    },
    isDropDown: function(){
        return hdropDownState.current == this;
    }
};

module.exports = hdropDown;
