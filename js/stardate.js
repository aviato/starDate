/* 
    Stardate 2015
    Ryan S. Price
*/

var StarDate = function () {
    this.heading    = document.querySelector('.headingContainer');   // this is where heading stuff goes
    this.container  = document.querySelector('.calendarContainer');  // this is where calendar stuff goes
    this.buttonWrap = document.querySelector('.buttonContainer');    // this is where buttons go
    this.dateInfo   = new Date();                                    // creates a new date object
    this.date       = this.dateInfo.getDate();                       // returns value 1-31
    this.today      = this.dateInfo.getDay();                        // returns value 0-6
    this.month      = this.dateInfo.getMonth();                      // returns value 0-11
    this.year       = this.dateInfo.getFullYear();                   // returns 4 digit year value
    this.monthArray = [];                                            // stores Month objects
    this.dayArray   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //this.user       = new User();                                    // will create a user object
    //this.toDoArray = [];                                            // will store toDo objects
};

// function creates a month class and an object for each month of the year
// then adds all the month objects to StarDate.monthArray
StarDate.prototype.monthMachine = function () {
    function Month(monthName, numDays, season) {
        this.monthName = monthName;
        this.numDays   = numDays;
        this.season    = season;
    }
    var january          = new Month("January", 31, "Winter");
    var february         = new Month("February", 28, "Winter");
    var march            = new Month("March", 31, "Spring");
    var april            = new Month("April", 30, "Spring");
    var may              = new Month("May", 31, "Spring");
    var june             = new Month("June", 30, "Summer");
    var july             = new Month("July", 31, "Summer");
    var august           = new Month("August", 31, "Summer");
    var september        = new Month("September", 30, "Autumn");
    var october          = new Month("October", 31, "Autumn");
    var november         = new Month("November", 30, "Autumn");
    var decemeber        = new Month("December", 31, "Winter");
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

// displays the current year in StarDate.heading
StarDate.prototype.displayYear = function () {
    this.yearEl      = document.createElement('h2');
    this.displayYear = document.createTextNode(this.year);
    this.yearEl.appendChild(this.displayYear);
    this.heading.appendChild(this.yearEl);
};

// creates a button class which instantiates 2 button objects
// and adds them to the DOM on instantiation
StarDate.prototype.createButtons = function () {
    var _this = this;
    function ButtonEl(el, cssClass, text) {
        this.el       = el;
        this.cssClass = cssClass;
        this.text     = text;
        this.buttonNode = document.createElement(el);
        this.buttonNode.className = this.cssClass;
        this.buttonText = document.createTextNode(this.text);
        this.buttonNode.appendChild(this.buttonText);
        _this.buttonWrap.appendChild(this.buttonNode);
    }
    this.prevButton = new ButtonEl('button', 'prevMonth', '<');
    this.nextButton = new ButtonEl('button', 'nextMonth', '>');
    var nextMonthBind   = this.nextMonth.bind(this);
    var prevMonthBind   = this.prevMonth.bind(this);
    this.nextButton.buttonNode.addEventListener('click', nextMonthBind, false);
    this.prevButton.buttonNode.addEventListener('click', prevMonthBind, false);
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

// create DOM nodes to hold objects
StarDate.prototype.createDateNodeContainer = function () {
    this.datesContainer = document.createElement('div');
    this.datesContainer.className = 'datesContainer';
    this.container.appendChild(this.datesContainer);
};

// create a container for the day-labels
StarDate.prototype.createDayLabelContainer = function () {
    this.dayLabelContainer = document.createElement('div');
    this.dayLabelContainer.className = 'dayLabelContainer';
    this.container.appendChild(this.dayLabelContainer);
};

// create day-labels and append them to the container
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
        m  = 13;
        y -= 1;
    }
    if (m === 2) {
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
        this.dateNode.className = 'dateNodeWrap';
        this.datesContainer.appendChild(this.dateNode);
        // if (currentMonth.monthVal === this.month && i === this.date) { <-- broken
        //     this.dateNode.className = 'currentDayNode';
        // }
    }
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
    //this.getCurrentDayNode();
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
