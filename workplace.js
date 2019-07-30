class Workplace extends Building {
    constructor(level) {
        super();
        this.level = level;
        this.workplaces = myRand(10, 40);
        this.workers = [];
        this.info = [
            {property: "Workers", value: this.workers},
            {property: "Workplaces", value: this.workplaces},
            {property: "Education requirement", value: education[this.level]},
        ]
    }
}

class School extends Workplace {
    constructor(size, level) {
        super(level);
        // this.size = size;
        this.level = level;
        this.students = [];
        this.seats = myRand(100, 300);
        this.schoolName;
        this.info = [
            {property: "Students", value: this.students},
            {property: "Total seats", value: this.seats},
        ]
    }

    // setProperties() {
    //     switch (this.level) {
    //         case 1: //Elementary
    //             this.studentLimit = 200;
    //             this.teacherLimit = 10;
    //             this.classSize = 20;
    //             this.cost = 300000;
    //             this.schoolName = "Elementary";
    //             break;
    //         case 2: //High School
    //             this.studentLimit = 500;
    //             this.teacherLimit = 20;
    //             this.classSize = 25;
    //             this.cost = 800000;
    //             this.schoolName = "High School";
    //             break;
    //         case 3: //College/University
    //             this.studentLimit = 1000;
    //             this.teacherLimit = 25;
    //             this.classSize = 40;
    //             this.cost = 1500000;
    //             if (Math.random() < 0.5) {
    //                 this.schoolName = "College"
    //             }
    //             else {
    //                 this.schoolName = "University"
    //             }
    //             break;
    //     }
    //     this.studentLimit *= this.size;
    //     this.teacherLimit *= this.size;
    //     this.cost *= this.size * 0.8;
    // }

    get schoolName() {
        let combined = randIn(surNames) + randIn(surNames);
        let lower = combined.toLowerCase();
        let schoolName = lower.charAt(0).toUpperCase() + lower.slice(1);
        this.buildingName = schoolName + " " + education[this.level];
    }
}

class Industry extends Workplace {
    constructor(level) {
        super(level);
        this.buildingName = `${randIn(surNames)}'s ${randIn(industries.filter(industry => industry.level === this.level)).name}`
    }
}