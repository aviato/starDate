// test date objects

var test1 = new Date(2016, 2, 17); // should displace 2 nodes and start on tuesday
var test2 = new Date(2016, 3, 29); // should displace 5 nodes and start on Fri
var test3 = new Date(2016, 1, 18); // should displace 1 node start on Monday

var StarDate = function() {
    this.container  = document.querySelector('.container');
    this.dateInfo   = new Date();
    this.date       = this.dateInfo.getDate();
    this.today      = this.dateInfo.getDay();
    this.month      = this.dateInfo.getMonth();
    this.year       = this.dateInfo.getFullYear();
    this.monthArray = [];
    this.dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday",
                "Thursday", "Friday", "Saturday"];
    this.currentDay = this.dayArray[this.today];
    this.displaceVal = this.displaceDateNodes();


};

// make month machine it's own month class
StarDate.prototype.monthMachine = function() {

    function Month(monthName, numDays, season) {
        this.monthName = monthName;
        this.numDays   = numDays;
        this.season    = season;
    }

    var january           = new Month("January", 31, "Winter");
    var february          = new Month("February", 28, "Winter");
    var march             = new Month("March", 31, "Spring");
    var april             = new Month("April", 30, "Spring");
    var may               = new Month("May", 31, "Spring");
    var june              = new Month("June", 30, "Summer");
    var july              = new Month("July", 31, "Summer");
    var august            = new Month("August", 31, "Summer");
    var september         = new Month("September", 30, "Autumn");
    var october           = new Month("October", 31, "Autumn");
    var november          = new Month("November", 30, "Autumn");
    var decemeber         = new Month("December", 31, "Winter");
    if (starDate.year % 4 === 0) { february.numDays = 29; }

    this.monthArray.push(january, february, march,
                            april, may, june, july,
                            august, september, october,
                            november, decemeber);
};

StarDate.prototype.displaceDateNodes = function() {
    var cd = this.date;
    while (cd > 0) {
        console.log(cd);
        cd -= 7;
    }
    var displaceVal = (Math.abs(cd) + 1) + this.today;
    //console.log(displaceVal);
    if (displaceVal >= 7) { displaceVal -= 7; }
    //console.log(displaceVal);
    return displaceVal;
};

StarDate.prototype.createDayLabels = function() {
    for (var i = 0; i < this.dayArray.length; i++) {
        var dayLabel = document.createElement('div');
        var dayLabelText = document.createTextNode(this.dayArray[i]);
        dayLabel.appendChild(dayLabelText);
        dayLabel.className += 'dateNodeWrap';
        this.container.appendChild(dayLabel);
    }
};

StarDate.prototype.createDisplaceNodes = function() {
    for (var i = 0; i < this.displaceVal; i++) {
        if (this.displaceVal === i) { break; }
        var displaceDateNode = document.createElement('div');
        var displaceText     = document.createTextNode('0');
        displaceDateNode.appendChild(displaceText);
        displaceDateNode.className += 'displaceDateNodeWrap';
        this.container.appendChild(displaceDateNode);
    }
};

StarDate.prototype.createHTMLMonthNodes = function() {
    var currentMonth = this.monthArray[this.month];
    for (var i = 1; i <= currentMonth.numDays; i++) {
        var dateNode = document.createElement('div');
        var dateText = document.createTextNode(i);
        dateNode.appendChild(dateText);
        dateNode.className += 'dateNodeWrap';
        this.container.appendChild(dateNode);
        if (this.date === i) {
            dateNode.className += 'dateNodeWrap currentDayNode';
        }
    }
};

var starDate = new StarDate();
starDate.monthMachine();
starDate.createDayLabels();
starDate.displaceDateNodes();
starDate.createDisplaceNodes();
starDate.createHTMLMonthNodes();
