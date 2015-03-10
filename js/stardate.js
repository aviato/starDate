/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * S T A R D A T E * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var StarDate = function () {
    this.heading = document.querySelector('.headingContainer');     // this is where heading stuff goes
    this.container = document.querySelector('.calendarContainer');  // this is where calendar stuff goes
    this.dateInfo = new Date();                                     // creates a new date object
    this.date = this.dateInfo.getDate();                            // returns value 1-31
    this.today = this.dateInfo.getDay();                            // returns value 0-6
    this.month = this.dateInfo.getMonth();                          // returns value 0-11
    this.year = this.dateInfo.getFullYear();                        // returns 4 digit year value
    this.monthArray = [];                                           // stores Month objects
    this.dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //this.displaceVal = this.getDisplaceVal(); // returns value 1-6 to displace the current month by
};

// this method will provide tests for the calendar
// var test1 = new Date(2016, 2, 17); // should displace 2 nodes and start on tuesday
// var test2 = new Date(2016, 3, 29); // should displace 5 nodes and start on Fri
// var test3 = new Date(2016, 1, 18); // should displace 1 node start on Monday
// StarDate.prototype.testDates = function () {};

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
    function Month(monthName, numDays, season) {
        this.monthName = monthName;
        this.numDays   = numDays;
        this.season    = season;
    }
    var january = new Month("January", 31, "Winter");
    var february = new Month("February", 28, "Winter");
    var march = new Month("March", 31, "Spring");
    var april = new Month("April", 30, "Spring");
    var may = new Month("May", 31, "Spring");
    var june = new Month("June", 30, "Summer");
    var july = new Month("July", 31, "Summer");
    var august = new Month("August", 31, "Summer");
    var september = new Month("September", 30, "Autumn");
    var october = new Month("October", 31, "Autumn");
    var november = new Month("November", 30, "Autumn");
    var decemeber = new Month("December", 31, "Winter");
    if (this.year % 4 === 0) {
        february.numDays = 29;
    }
    this.monthArray.push(january, february, march, april, may, june, july, august, september, october, november, decemeber);
};

StarDate.prototype.displayMonth = function () {
    var currentMonth  = this.monthArray[this.month];
    this.monthEl      = document.createElement('h1');
    this.displayMonth = document.createTextNode(currentMonth.monthName);
    this.monthEl.appendChild(this.displayMonth);
    this.heading.appendChild(this.monthEl);
};

// get next month
StarDate.prototype.nextMonth = function () {
    console.log('getting next month');
    this.clearHTMLDateNodes();
    this.month += 1;
    if (this.month > 11) {
        this.month = 0;
        this.year += 1;
        this.yearEl.textContent = this.year;
    }
    var currentMonth = this.monthArray[this.month];
    this.monthEl.textContent = currentMonth.monthName;

    return this.initBody();
};

// get previous month
StarDate.prototype.prevMonth = function () {
    console.log('getting previous month');
    this.clearHTMLDateNodes();
    this.month -= 1;
    if (this.month < 0) {
        this.month = 11;
        this.year -= 1;
        this.yearEl.textContent = this.year;
    }
    var currentMonth = this.monthArray[this.month];
    this.monthEl.textContent = currentMonth.monthName;
    return this.initBody();
};

// creates a button class which instantiates 2 button objects
// and adds them to the DOM on instantiation
StarDate.prototype.createButtons = function () {
    var _this = this;
    function ButtonEl(el, cssClass) {
        this.el = el;
        this.cssClass = cssClass;
        this.buttonNode = document.createElement(el);
        el.className += this.cssClass;
        _this.heading.appendChild(this.buttonNode);
    }
    this.nextButton = new ButtonEl('button', 'nextMonth');
    this.prevButton = new ButtonEl('button', 'prevMonth');
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

// returns a value to displace date nodes by based on the current
// value of this.date
// StarDate.prototype.getDisplaceVal = function () {
//     var cd = this.date;
//     while (cd > 0) {
//         cd -= 7;
//     }
//     var displaceVal = (Math.abs(cd) + 1) + this.today;
//     if (displaceVal >= 7) {
//         displaceVal -= 7;
//     }
//     return displaceVal;
// };

StarDate.prototype.createDayLabelContainer = function () {
    this.dayLabelContainer = document.createElement('div');
    this.dayLabelContainer.className = 'dayLabelContainer';
    this.container.appendChild(this.dayLabelContainer);
};

// creates day-label nodes and appends them to this.container
StarDate.prototype.createDayLabels = function () {
    var i;
    for (i = 0; i < this.dayArray.length; i++) {
        var dayLabel = document.createElement('div');
        var dayLabelText = document.createTextNode(this.dayArray[i]);
        dayLabel.appendChild(dayLabelText);
        dayLabel.className += 'dateNodeWrap';
        this.dayLabelContainer.appendChild(dayLabel);
    }
};



// creates displace nodes based on the value of this.getDisplaceVal
// StarDate.prototype.createDisplaceNodes = function () {
//     var i;
//     for (i = 0; i < this.displaceVal; i++) {
//         if (this.displaceVal === i) {
//             break;
//         }
//         this.displaceDateNode = document.createElement('div');
//         this.displaceText = document.createTextNode('0');
//         this.displaceDateNode.appendChild(this.displaceText);
//         this.displaceDateNode.className += 'displaceDateNodeWrap';
//         this.datesContainer.appendChild(this.displaceDateNode);
//     }
// };

// need to fix this.displaceNodes using a different value
// using the first day of each month instead of the current date
//StarDate.prototype.createDisplaceNodes = function() {};

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
        if (this.date === i) {
            this.dateNode.className += 'dateNodeWrap currentDayNode';
        }
    }
};

// removes date nodes from the DOM
StarDate.prototype.clearHTMLDateNodes = function () {
    this.container.removeChild(this.datesContainer);
    console.log('working');
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
    this.createHTMLDateNodes();
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
