let filteredData = cardArray.filter(card => card.status != "archived");


let created = new Date(project.dateCreated);
let now = new Date();

function daysSince(created, now) {
    let diff = now.getTime() - created.getTime();
    let days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
}

console.log(`This project it ${daysSince(created, now)} days old`);
