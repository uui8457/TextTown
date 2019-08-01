class Hospital extends Workplace {
    constructor() {
        super(2);
        this.patients = [];
        this.beds = myRand(75, 200)
    }
}