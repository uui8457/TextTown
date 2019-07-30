class Building {
    constructor() {
        this.findStreet();
        // this.established = time.calcDate(0);
        this.information = [{property: "Street", value: this.street}];
    }

    findStreet() {
        let vacantStreets = city.streets.filter(street => street.buildings.length < street.lots);

        if (vacantStreets.length === 0 || Math.random() > 0.9) {
            vacantStreets.push(new Street)
        }
        this.street = randIn(vacantStreets);
        this.street.buildings.push(this);
    }

    set buildingName(name) {
        this.name = name; //Well this is redundant, or is it?
        newLink([this, " has just been built at", this.street, this.streetNumber]);
    }

    get streetNumber() {
        return this.street.buildings.indexOf(this) + 1
    }

    set info(moreInfo) {
        moreInfo.forEach(property => this.information.push(property))
    }

    get info() {
        //Assuming the title will always be this.name
        return this.information
    }
}

class Residential extends Building {
    constructor(size, type) {
        super();
        switch (size) {
            case 1:
                this.size = "Small";
                break;
            case 2:
                this.size = "Medium";
                break;
            case 3:
                this.size = "Large";
                break;
        }
        switch (type) {
            case 1:
                this.type = "House";
                break;
            case 2:
                this.type = "Apartment";
                break;
            case 3:
                this.type = "Highrise";
                break;
        }
        this.buildingName = `A ${this.size} ${this.type}`;
        this.multipliers = size*Math.pow(10,type-1);
        this.residents = [];
        this.info = [{property: "Residents", value: this.residents}]
    }

    set multipliers(factor) {
        //Consider renaming
        this.homes = Math.floor(factor);
        // city.homes += this.homes;
        // this.rent = factor * 2000;
        //Logarithmic curves:
        // this.power = Math.floor(Math.pow(factor, 0.8));
        // this.water = Math.floor(Math.pow(factor, 0.6));
        // console.log("multiplier set")
        this.info = [{property: "Homes", value: this.homes}]
    }
}