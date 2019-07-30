

let city = {
    name: "City",
    streets: [],
    families: [],
    get population() {
        let people = [];
        city.families.forEach(function (family) {
                people.push(family.members)
            }
        );
        return people.flat();
    },
    get buildings() {
        let buildings = [];
        city.streets.forEach(function (street) {
                buildings.push(street.buildings)
            }
        );
        return buildings.flat();
    },
    get schools() {
        return this.buildings.filter(building => building instanceof School)
    },
    get info() {
        return [
            {property: "Streets", value: this.streets},
            {property: "Buildings", value: this.buildings},
            {property: "Schools", value: this.schools},
            {property: "Families", value: this.families},
            {property: "Population", value: this.population},
            // {property: "Buildings", value: this.buildings},
        ]
    }
};
let stats = {
    name: "Statistics",
    get meanAge() {
        let totalMonthAge = 0;
        city.population.forEach(person => totalMonthAge += person.monthAge);
        return (totalMonthAge/12)/city.population.length
    },
    get meanEducation() {
        let totalEducation = 0;
        city.population.forEach(person => totalEducation += person.educationLevel);
        return totalEducation/city.population.length
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

let detailedObject;

let timeStep = setInterval(update, 2500);
let time = {
    startYear: 2020,
    elapsedMonths: 0,
    get month() {
        return this.elapsedMonths % 12
    },
    get year() {
        return this.startYear + Math.floor(this.elapsedMonths / 12)
    },
    get elapsedYears() {
        return Math.floor(this.elapsedMonths / 12)
    },
    get date() {
        return `${months[this.elapsedMonths % 12]} ${this.year}`
    },
    calcDate(monthsBack) {
        return `${months[11 + ((time.elapsedMonths - monthsBack) % 12)]} ${this.startYear + Math.floor((time.elapsedMonths - monthsBack) / 12)}`
    }
};


window.addEventListener("DOMContentLoaded", () => {
    details(city);
    themeChange("light")
});

// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

function changeSpeed(button) {
    // console.log(Array.from(document.getElementById("timeStuff").children));
    Array.from(document.getElementById("timeButtons").children).forEach(button => button.style.backgroundColor = "lightgray");
    button.style.backgroundColor = "gray";
    clearInterval(timeStep);
    if (button.value > 10) {
        timeStep = setInterval(update, button.value)
    }
}

function update() {
    time.elapsedMonths++;

    document.getElementById("date").innerText = `(${time.elapsedYears}) ${time.date}`;

    if (time.month === 0) {
        newEvent([`Happy new year ${time.year}!`]);
    }

    city.families.forEach(family => family.update());

    details(detailedObject); // Makes the open object update automatically (re-opens it every update, might cause problems with a back button)
}


function newEvent(textArray) {
    let container = document.getElementById("eventsContainer");
    //If there are too many events, remove the oldest ones.
    // while (container.childNodes.length > 200) {
    //     container.removeChild(container.lastChild)
    // }

    let event = document.createElement("div");
    event.className = "event";
    let content = document.createElement("div");
    textArray.forEach(function (bit) {
        if (typeof bit === "object") {
            let link = document.createElement("a");
            link.innerText = bit.name;
            link.setAttribute('href', "javascript:void(0)");
            link.onclick = () => details(bit); // This is what needs to be a new function
            content.appendChild(link)
        } else {
            let text = document.createElement("span");
            text.innerText = ` ${bit} `;
            content.appendChild(text)
        }
    });
    event.appendChild(content);

    //Add date div
    let date = document.createElement("div");
    date.className = "eventDate";
    date.innerText = time.date;
    event.appendChild(date);
    container.insertBefore(event, document.getElementById("eventsContainer").firstChild);
    filterEvents();

    setTimeout(() => event.style.opacity = "1", 1);

}

function details(object) { //For a back button: add the previous object onclick before deleting all elements
    let container = document.getElementById("infoContainer");
    detailedObject = object;

    //Set the back button
    // document.getElementById("infoBack").onclick = () => {
    //     details(openInfo[openInfo.length - 2]);
    //     console.log(openInfo);
    //     openInfo.splice(openInfo[openInfo.length - 1])
    // };
    // openInfo.push(object);
    // console.log(openInfo);
    //Remove all the old info
    while (container.firstChild) {
        container.removeChild(container.lastChild)
    }


    let title = document.getElementById("infoTitle");
    title.innerText = object.name;

    // console.log(object.info);
    for (let p = 0; p < object.info.length; p++) {
        let div = document.createElement("div");

        let key = document.createElement("p");
        key.innerText = object.info[p].property;
        div.appendChild(key);

        //Depending on what type it is, do different things.
        let valueDiv = document.createElement("div");
        if (typeof object.info[p].value === "string" || typeof object.info[p].value === "number") {
            valueDiv.innerText = object.info[p].value;
        } else {
            //First check if there is anything at all
            if (object.info[p].value === undefined || object.info[p].value.length === 0) {
                valueDiv.innerText = "None"
            }
            //If there is, loop through all objects and make a separate link for each
            else {
                let valueArr = Array(object.info[p].value).flat(); //Might be problematic
                valueArr.forEach(function (value) {
                    let a = document.createElement("a");
                    a.innerText = value.name;
                    a.setAttribute('href', "javascript:void(0)");
                    a.onclick = () => details(value);
                    valueDiv.appendChild(a);
                })
            }
        }
        div.appendChild(valueDiv);
        container.appendChild(div);
    }
}

function filterEvents() {
    let events = document.getElementById("eventsContainer").childNodes;
    let filter = document.getElementById("eventFilter").value.toUpperCase();

    for (let n = 0; n < events.length; n++) {
        if (events[n].textContent.toUpperCase().indexOf(filter) > -1) {
            events[n].style.display = "grid";
        } else {
            events[n].style.display = "none";
        }
    }
}

function preFabFamily() {
    // createMembers() {
    //Create adults, consider making it a possibility of having only one adult.
    let members = [
        new Person(myRand(30*12, 50*12), myRand(0, 3)),
        new Person(myRand(30*12, 50*12), myRand(0, 3)),
    ];
    //Make the adults be each other's partners
    members[0].partner = members[1];
    members[1].partner = members[0];

    //Consider a different approach for creating children, with non-linear probability
    for (let n = 0; n < myRand(0, 4); n++) {
        let monthAge = myRand(0, 18 * 12);
        let educationLevel = 0;
        if (monthAge / 12 >= 15) {
            educationLevel = 1
        } else if (monthAge / 12 >= 18) {
            educationLevel = 2
        }
        members.push(new Person(monthAge, educationLevel));
    }
    new Family(members, randIn(surNames))
    // }
}

function starterKit() {
    new Industry(0);
    new Industry(1);
    new Industry(2);
    new Industry(3);

    new School(1, 1);
    new School(1, 2);
    new School(1, 3);

    new Residential(3, 2);
    for (let n = 0; n < 10; n++) {
        preFabFamily()
    }
}

function themeChange(theme) {
    let darkStyle = document.styleSheets[1];

    switch (theme) {
        case "light":
            darkStyle.disabled = true;
            break;
        case "dark":
            darkStyle.disabled = false;
    }
}