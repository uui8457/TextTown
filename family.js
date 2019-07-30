class Family { //Change it so that members are created separately and then put into it
    constructor(members, surname) { //Do something with this array
        this.members = members;
        this.members.forEach(member => member.family = this);

        this.surname = surname;
        this.name = `The ${this.surname} family`;
        // this.createMembers();
        city.families.push(this);
        this.findResidence();
        this.info = [
            {property: "Members", value: this.members},
            {property: "Lives in", value: this.residence},
            {property: "Street", value: this.residence.street},
        ]
    }


    update() {
        if (this.members.length === 0) {
            if (this.residence !== undefined) {
                this.residence.residents.splice(this.residence.residents.indexOf(this), 1);
            }
            city.families.splice(city.families.indexOf(this), 1);
            newEvent(["The last member of", this.name, "is dead"]);
            return;
        }

        this.members.forEach(person => person.update()); //Families can be abandoned, fix this in some way

        if (!(this.residence instanceof Building)) {
            newEvent([this, "want a house to live in"]);
            this.findResidence()
        }

        if (this.members[0].partner === this.members[1] && this.members.length <= 4) { //if both parents are present
            if (Math.random() > 1 - (Math.pow(this.members.length, 2) / 1000)) {
                console.log("new baby");
                let newBorn = new Person(0,0);
                newBorn.family = this;
                this.members.push(newBorn);
                newEvent([this, "welcomes", newBorn, "to the family and the world!"])
            }
        }


    }

    findResidence() {
        //Find all buildings which have vacant homes by first:
        // finding all residential buildings in all streets.
        //Consider streamlining the whole filtering process.

        let residences = city.buildings.filter(building => building instanceof Residential);
        let vacancies = residences.filter(residence => residence.residents.length < residence.homes);

        if (vacancies.length === 0) {
            this.residence = randIn(homelessPlaces);
        } else {
            this.residence = randIn(vacancies);
            this.residence.residents.push(this);
            newEvent([this, "has just moved into a", this.residence, "at", this.residence.street, this.residence.streetNumber])
        }
    }
}