class Hospital extends Workplace {
    constructor() {
        super(2);
        this.buildingName = "General Hospital";  // Make it fancier
        this.patients = [];
        this.beds = myRand(75, 200);
        this.info = [
            {property: "Patients", value: this.patients},
            {property: "Total beds", value: this.beds},
        ]
    }
}