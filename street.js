class Street {
    constructor() {
        this.name = randIn(streetNames);
        this.lots = myRand(10, 40);
        this.buildings = [];
        city.streets.push(this);
        this.info = [
            {property: "Buildings", value: this.buildings},
            {property: "Lots", value: this.lots},
        ]

    }
}