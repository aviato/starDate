/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * S T A R D A T E * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var StarDate = function () {
    this.heading    = document.querySelector('.headingContainer');   // this is where heading stuff goes
    this.container  = document.querySelector('.calendarContainer');  // this is where calendar stuff goes
    this.dateInfo   = new Date();                                    // creates a new date object
    this.date       = this.dateInfo.getDate();                       // returns value 1-31
    this.today      = this.dateInfo.getDay();                        // returns value 0-6
    this.month      = this.dateInfo.getMonth();                      // returns value 0-11
    this.year       = this.dateInfo.getFullYear();                   // returns 4 digit year value
    this.monthArray = [];                                            // stores Month objects
    this.dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
};

// displays the current year in StarDate.heading
StarDate.prototype.displayYear = function () {
    this.yearEl      = document.createElement('h2');
    this.displayYear = document.createTextNode(this.year);
    this.yearEl.appendChild(this.displayYear);
    this.heading.appendChild(this.yearEl);
};

// function creates a month classe and an object for each month of the year
// then adds all the month objects to StarDate.monthArray
StarDate.prototype.monthMachine = function () {
    function Month(monthVal, monthName, numDays, season) {
        this.monthVal  = monthVal;
        this.monthName = monthName;
        this.numDays   = numDays;
        this.season    = season;
    }
    var january          = new Month(0, "January", 31, "Winter");
    var february         = new Month(1, "February", 28, "Winter");
    var march            = new Month(2, "March", 31, "Spring");
    var april            = new Month(3, "April", 30, "Spring");
    var may              = new Month(4, "May", 31, "Spring");
    var june             = new Month(5, "June", 30, "Summer");
    var july             = new Month(6, "July", 31, "Summer");
    var august           = new Month(7, "August", 31, "Summer");
    var september        = new Month(8, "September", 30, "Autumn");
    var october          = new Month(9, "October", 31, "Autumn");
    var november         = new Month(10, "November", 30, "Autumn");
    var decemeber        = new Month(11, "December", 31, "Winter");
    this.monthArray.push(january, february, march, april, may, june, july, august, september, october, november, decemeber);
};

// display current month in StarDate.heading
StarDate.prototype.displayMonth = function () {
    var currentMonth  = this.monthArray[this.month];
    this.monthEl      = document.createElement('h1');
    this.displayMonth = document.createTextNode(currentMonth.monthName);
    this.monthEl.appendChild(this.displayMonth);
    this.heading.appendChild(this.monthEl);
};

// get next month
StarDate.prototype.nextMonth = function () {
    this.clearHTMLDateNodes();
    this.month += 1;
    if (this.month > 11) {
        this.month = 0;
        this.year += 1;
        this.yearEl.textContent = this.year;
    }
    var currentMonth = this.monthArray[this.month];
    this.monthEl.textContent = currentMonth.monthName;
    if (currentMonth.monthName === "February" && this.year % 4 === 0) {
        currentMonth.numDays = 29;
    } else if (currentMonth.monthName === "February" && this.year % 4 > 0) {
        currentMonth.numDays = 28;
    }
    return this.initBody();
};

// get previous month
StarDate.prototype.prevMonth = function () {
    this.clearHTMLDateNodes();
    this.month -= 1;
    if (this.month < 0) {
        this.month = 11;
        this.year -= 1;
        this.yearEl.textContent = this.year;
    }
    var currentMonth = this.monthArray[this.month];
    this.monthEl.textContent = currentMonth.monthName;
    if (currentMonth.monthName === "February" && this.year % 4 === 0) {
        currentMonth.numDays = 29;
    }
    return this.initBody();
};

// creates a button class which instantiates 2 button objects
// and adds them to the DOM on instantiation
StarDate.prototype.createButtons = function () {
    var _this = this;
    function ButtonEl(el, cssClass) {
        this.el       = el;
        this.cssClass = cssClass;
        this.buttonNode = document.createElement(el);
        el.className += this.cssClass;
        _this.heading.appendChild(this.buttonNode);
    }
    this.prevButton = new ButtonEl('button', 'prevMonth');
    this.nextButton = new ButtonEl('button', 'nextMonth');
    var nextMonthBind   = this.nextMonth.bind(this);
    var prevMonthBind   = this.prevMonth.bind(this);
    this.nextButton.buttonNode.addEventListener('click', nextMonthBind);
    this.prevButton.buttonNode.addEventListener('click', prevMonthBind);
};


StarDate.prototype.createDateNodeContainer = function () {
    this.datesContainer = document.createElement('div');
    this.datesContainer.className = 'datesContainer';
    this.container.appendChild(this.datesContainer);
};

StarDate.prototype.createDayLabelContainer = function () {
    this.dayLabelContainer = document.createElement('div');
    this.dayLabelContainer.className = 'dayLabelContainer';
    this.container.appendChild(this.dayLabelContainer);
};

// creates day-label nodes and appends them to this.container
StarDate.prototype.createDayLabels = function () {
    var i;
    for (i = 0; i < this.dayArray.length; i++) {
        var dayLabel     = document.createElement('div');
        var dayLabelText = document.createTextNode(this.dayArray[i]);
        dayLabel.appendChild(dayLabelText);
        dayLabel.className += 'dateNodeWrap';
        this.dayLabelContainer.appendChild(dayLabel);
    }
};

// returns number of nodes to displace 1st day of month by
// N = d + 2m + [3(m+1)/5] + y + [y/4] - [y/100] + [y/400] + 2
StarDate.prototype.getDisplaceVal = function () {
    var y = this.year;
    var m = this.month + 1;

    if (m === 1) {
        console.log('jan: true');
        m  = 13;
        y -= 1;
    }
    if (m === 2) {
        console.log('feb: true');
        m  = 14;
        y -= 1;
    }

    var result = 2*m + Math.floor(3*(m+1)/5) + y + Math.floor(y/4) -
    Math.floor(y/100) + Math.floor(y/400) + 2;

    this.displaceVal = result % 7;

    if (this.displaceVal < 0){
        this.displaceVal = 6;
    }

    return this.displaceVal;
};

// creates displace nodes based on the value of this.getDisplaceVal
StarDate.prototype.createDisplaceNodes = function () {
    var i;
    for (i = 0; i < this.displaceVal; i++) {
        if (this.displaceVal === i) {
            break;
        }
        this.displaceDateNode = document.createElement('div');
        this.displaceText = document.createTextNode('0');
        this.displaceDateNode.appendChild(this.displaceText);
        this.displaceDateNode.className += 'displaceDateNodeWrap';
        this.datesContainer.appendChild(this.displaceDateNode);
    }
};

// creates a date node for each day of the month and adds it to the
// DOM. Uses 'i' to determine the current date and highlight it
StarDate.prototype.createHTMLDateNodes = function () {
    var i;
    var currentMonth = this.monthArray[this.month];
    for (i = 1; i <= currentMonth.numDays; i++) {
        this.dateNode = document.createElement('div');
        this.dateText = document.createTextNode(i);
        this.dateNode.appendChild(this.dateText);
        this.dateNode.className += 'dateNodeWrap';
        this.datesContainer.appendChild(this.dateNode);
        // if (currentMonth.monthVal === this.month && i === this.date) { <-- broken
        //     this.dateNode.className = 'currentDayNode';
        // }
    }
};

StarDate.prototype.getCurrentDayNode = function () {

};

// removes date nodes from the DOM
StarDate.prototype.clearHTMLDateNodes = function () {
    this.container.removeChild(this.datesContainer);
};

// initialize necessary objects
StarDate.prototype.initObjects = function() {
    this.monthMachine();
    this.createButtons();
    this.createDayLabelContainer();
};

// calls methods to generate the calendar heading
StarDate.prototype.initHeading = function () {
    this.displayMonth();
    this.displayYear();
    this.createDayLabels();
};

// calls methods to generate the calendar body
StarDate.prototype.initBody = function () {
    this.createDateNodeContainer();
    this.getDisplaceVal();
    this.createDisplaceNodes();
    this.createHTMLDateNodes();
    this.getCurrentDayNode();
};

// initialize the calendar
StarDate.prototype.initCalendar = function () {
    this.initHeading();
    this.initBody();
};

// instantiate the StarDate class
var starDate = new StarDate();

// initialize the calendar
starDate.initObjects();
starDate.initCalendar();
