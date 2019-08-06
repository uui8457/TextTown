let stats = {
    name: "Statistics",
    populationHistory: [],
    get meanAge() {
        let totalMonthAge = 0;
        city.population.forEach(person => totalMonthAge += person.monthAge);
        return (totalMonthAge / 12) / city.population.length
    },
    get meanEducation() {
        let totalEducation = 0;
        city.population.forEach(person => totalEducation += person.educationLevel);
        return totalEducation / city.population.length
    },
    get info() {
        return [
            {property: "Population", value: city.population.length},
            {property: "Mean age", value: this.meanAge},
            {property: "Mean education", value: this.meanEducation},
            // # of Empty homes
            // # empty workplaces and so on
        ]
    }
};


function statGraph() {
    let pop = stats.populationHistory;
    pop.push(city.population.length);
    let canvas = document.getElementById("statCanvas");
    let ctx = canvas.getContext("2d");

    let steps = Math.pow(document.getElementById("graphRange").value+1, 2);
    let range = pop.slice(Math.max(0, pop.length-steps));
    let max = Math.max(...range);
    let min = Math.min(...range);
    let factor = Math.ceil(max/canvas.height*10)/10;
    // let adjust = Math.floor(min/canvas.height*10)/10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height - range[range.length - 1]/factor);

    for (let x = 0; x < steps; x++) {
        ctx.lineTo(canvas.width - (canvas.width / steps) * x, canvas.height - range[range.length - 1 - x]/factor || canvas.height);
    }
    ctx.stroke();
}