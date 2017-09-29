var Main = function() {
    this.text = "%";
    this.getRandomNumber = function() {
        return Math.ceil(100 * Math.random());
    }
};

new Main();
