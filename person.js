class Person {
    constructor(monthAge, educationLevel) { // age Should be set by month, so that we can have newborns
        // this.family = family; (!)
        this.firstName = randIn(firstNames);
        // this.name =
        this.monthAge = monthAge;
        this.occupation = undefined;
        this.educationLevel = educationLevel;
        this.partner = undefined;
        this.sickness = 0;
    }

    get name() {
        return `${this.firstName} ${this.family.surname}`;
    }

    update() {
        this.monthAge += 1;
        // console.log(this.name + " is now " + this.age);
        if (this.occupation === undefined && this.age < 70 && this.sickness === 0) {
            this.findOccupation()
        }
        //If sick
        if (this.sickness > 0) {
            if (!(this.occupationType === "Hospitalized")) {
                this.findHospital()
            } else {
                if (Math.random() < 1 / 10000 && this.sickness === 4) {
                    createEvent([this, "has been cured from their", illness[this.sickness], "illness!"]);
                    this.sickness = 0;
                    autoSplice(this, "occupation");
                } else if (Math.random() < 1 / 1000 && this.sickness === 3) {
                    createEvent([this, "has been cured from their", illness[this.sickness], "illness!"]);
                    this.sickness = 0;
                    autoSplice(this, "occupation");
                } else if (Math.random() < 1 / 100 && this.sickness === 2) {
                    createEvent([this, "has been cured from their", illness[this.sickness], "illness!"]);
                    this.sickness = 0;
                    autoSplice(this, "occupation");
                } else if (Math.random() < 1 / 10 && this.sickness === 1) {
                    createEvent([this, "has been cured from their", illness[this.sickness], "illness!"]);
                    this.sickness = 0;
                    autoSplice(this, "occupation");
                }
            }
        }

        //Once every year
        if (time.month === 5) {
            if (this.occupationType === "Studying" && (this.age === 15 || this.age === 18 || this.age === 23)) {
                this.graduate()
            }
            if (this.occupationType === "Working" && this.occupation.level < this.educationLevel) {
                createEvent([this, "is underpaid and wants a better job."]);
                this.findOccupation()
            }
            // risk at age x = Math.exp(x/20)/1000
        }
        //Retire:
        if (this.occupationType === "Working" && this.age >= 70) {
            createEvent([this, "has retired from their work at", this.occupation]);
            // this.occupation.workers.splice(this.occupation.workers.indexOf(this), 1);
            // this.occupation = undefined;
            autoSplice(this, "occupation")
        }

        //Find a partner
        if (this.age >= 25 && this.partner === undefined) {
            // newEvent([this, "wants to find a partner"]);
            let singles = city.population.filter(person => person.partner === undefined && person.age <= this.age + 5 && person.age >= this.age - 5 && person.family !== this.family); //Consider making the age range larger for older this.ages
            if (singles.length !== 0) {
                this.partner = randIn(singles);
                this.partner.partner = this;
                createEvent([this, "is now together with", this.partner]);
                //Time to make a new family:
                //Splice them out of current family and

                let newSurname;
                if (Math.random() > 0.5) {
                    newSurname = this.family.surname
                } else {
                    newSurname = this.partner.family.surname
                }
                this.family.members.splice(this.family.members.indexOf(this), 1);
                this.partner.family.members.splice(this.partner.family.members.indexOf(this.partner), 1); //Maybe it's time to make this a function?
                //make a new one with (members = these two)
                new Family([this, this.partner], newSurname)
            }
        }

        //Get sick: base risk divided again for levels
        if (Math.random() < 1 / 1000 && this.sickness === 0) {
            //need to splice out of correct occ array
            // this.occupation = undefined;
            autoSplice(this, "occupation");

            if (Math.random() < 1 / 1000) {
                this.sickness = 4;
                createEvent([this, "has gotten extremely sick"])
            } else if (Math.random() < 1 / 100) {
                this.sickness = 3;
                createEvent([this, "has gotten very sick"])
            } else if (Math.random() < 1 / 10) {
                this.sickness = 2;
                createEvent([this, "has gotten rather sick"])
            } else {
                this.sickness = 1;
                createEvent([this, "has gotten slightly ill"])
            }
        }

        //Die of old age
        if (Math.random() < Math.exp(this.age / 20) / 1000 && time.month === myRand(0, 11) && this.age > 30) { //Its way too deadly at a low age, but good at not going too old
            this.kill();
            // return //Will this jump out of the function? Yes, apparently
        }
    }

    kill() {
        if (this.occupation !== undefined) {
            autoSplice(this, "occupation");
        }
        if (this.partner !== undefined) {
            this.partner.partner = undefined;
            this.partner = undefined
        }
        if (this.family.members.length !== 0) {
            createEvent([this.family, "is mourning the loss of", this.name, "at the age of", this.age])
        }

        autoSplice(this, "family");
    }

    get info() {
        return [
            {property: "Age", value: this.age},
            {property: "Family", value: this.family},
            {property: "Partner", value: this.partner},
            {property: "Currently", value: this.occupationType},
            {property: "At", value: this.occupation},
            // {property: "Pay grade", value: education[this.occupation.level]}, //Breaks if no occupation is defined
            {property: "Education", value: education[this.educationLevel]},
            {property: "Birth date", value: time.calcDate(this.monthAge)},
            {property: "Illness", value: illness[this.sickness]},
        ]
    }

    get age() {
        return Math.floor(this.monthAge / 12)
    }

    get occupationType() {
        if (city.students.indexOf(this) !== -1) {
            return "Studying"
        } else if (city.patients.indexOf(this) !== -1) {
            return "Hospitalized"
        } else if (this.occupation === undefined && this.age < 16) {
            return "Not going to school"
        } else if (this.occupation === undefined && this.age > 70) {
            return "Retired"
        } else if (this.occupation === undefined) {
            return "Unemployed"
        } else {
            return "Working"
        }
    }

    findOccupation() {
        if (this.age > 5 && this.age <= 15 && this.educationLevel === 0) {
            this.findSchool(1)
        } else if (this.age > 15 && this.age <= 18 && this.educationLevel === 1) {
            if (Math.random() < 0.9) {
                this.findSchool(2)
            } else {
                this.findWork()
            }
        } else if (this.age > 18 && this.age < 25 && this.educationLevel === 2) {
            if (Math.random() < 0.8) {
                this.findSchool(3)
            } else {
                this.findWork()
            }
        } else if (this.age > 18) {
            this.findWork()
        } else {
            // console.log(`${this.name} is too young to do anything useful`)
        }
    }

    findSchool(level) {
        let vacantSchools = city.schools.filter(school => school.level === level); // Needs to be modified so that only the correct type is selected
        // let schools = city.education.elementary.filter(school => school.students.length < school.seats);
        // console.log(vacantSchools);
        if (vacantSchools.length !== 0) {
            this.occupation = randIn(vacantSchools);
            this.occupation.students.push(this);
            createEvent([this, "is now studying at", this.occupation])
        }
    }

    findWork() {
        // console.log(`${this.name} is trying to find work now.`);

        //    Procedure: Filter out all workplaces which aren't full, and apply for one of the highest possible level, then the next one lower, and so on
        let workplaces = city.buildings.filter(building => building instanceof Workplace);
        let vacantWorkplaces = workplaces.filter(work => work.workplaces > work.workers.length);
        // console.log(vacantWorkplaces);
        for (let n = this.educationLevel; n >= 0; n--) {
            if (vacantWorkplaces.filter(work => work.level === n).length !== 0) {
                if (this.occupation !== undefined) {
                    if (n <= this.occupation.level) {
                        break
                    }
                }
                this.occupation = randIn(vacantWorkplaces.filter(work => work.level === n));
                this.occupation.workers.push(this);
                createEvent([this, "is now working at", this.occupation]);
                break
            }
        }
        if (this.occupation === undefined) {
            // console.log(this, "could not find work at level", n)
            createEvent([this, "could not find any work."])
        }

        // if (this.educationLevel >= 3 && vacantWorkplaces.filter(work => work.level === 3).length !== 0) {
        //     this.occupation = randIn(vacantWorkplaces.filter(work => work.level === 3));
        //     this.occupation.workers.push(this);
        // }
        // else if (this.educationLevel >= 2 && vacantWorkplaces.filter(work => work.level === 2).length !== 0) {
        //     this.occupation = randIn(vacantWorkplaces.filter(work => work.level === 2));
        //     this.occupation.workers.push(this);
        // }
        // else if (this.educationLevel >= 1 && vacantWorkplaces.filter(work => work.level === 1).length !== 0) {
        //     this.occupation = randIn(vacantWorkplaces.filter(work => work.level === 1));
        //     this.occupation.workers.push(this);
        // }
        // else if (this.educationLevel >= 0 && vacantWorkplaces.filter(work => work.level === 0).length !== 0) {
        //     this.occupation = randIn(vacantWorkplaces.filter(work => work.level === 0));
        //     this.occupation.workers.push(this);
        // }
        // else {
        //     newEvent([this, "could not find any work."]);
        // }
    }

    graduate() {
        // Remove this from occupation, and give ++ educationLevel
        this.educationLevel++;
        createEvent([this, "has graduated from", this.occupation]);
        autoSplice(this, "occupation")
        // this.occupation.students.splice(this.occupation.students.indexOf(this));
        // this.occupation = undefined;

    }

    findHospital() {
        let vacantHospitals = city.hospitals.filter(hospital => hospital.beds > hospital.patients.length);
        if (vacantHospitals.length !== 0) {
            this.occupation = randIn(vacantHospitals);
            this.occupation.patients.push(this);
            createEvent([this, "is now getting care at", this.occupation])
        }
    }
}
