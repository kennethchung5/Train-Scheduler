// Initialize Firebase
var config = {
    apiKey: "AIzaSyBOMQFuAxkBhO3aOze4hnHQwFhHWOh1nQ8",
    authDomain: "train-scheduler-19e0a.firebaseapp.com",
    databaseURL: "https://train-scheduler-19e0a.firebaseio.com",
    projectId: "train-scheduler-19e0a",
    storageBucket: "train-scheduler-19e0a.appspot.com",
    messagingSenderId: "675072996944"
};
firebase.initializeApp(config);

var database = firebase.database();

// variable to track parity of table rows
var rowCounter = 1;

$("form").on("submit", function(event) {
    event.preventDefault();

    var newEntry = {
        name: $("#nameInput").val().trim(),
        destination: $("#destinationInput").val().trim(),        
        start: $("#startInput").val().trim(),
        frequency: $("#frequencyInput").val().trim()
    };

    database.ref().push(newEntry);

    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#startInput").val("");
    $("#frequencyInput").val("");
    
});

database.ref().on("child_added", function(snapshot) {

    var newName = snapshot.val().name;
    var newDestination = snapshot.val().destination;
    var newStart = snapshot.val().start;
    var newFrequency = snapshot.val().frequency;

    var timeToNext = 0;
    var nextTrain;

    // console.log("newStart: " + newStart + "; newFrequency: " + newFrequency);

    // compare newStart to current time.
    var timeDiff = moment().diff(moment(newStart, "HH:mm"), "minutes");
    // console.log("The time difference is " + timeDiff + " minutes.");

    var newRow = $("<tr>");

    // check sign of timeDiff; if negative, then consider train to be not currently running
    if (timeDiff < 0) {
        timeToNext = -1 * timeDiff;        
        nextTrain = moment(newStart, "HH:mm").format("hh:mm A");        

        newRow.addClass("outService");
    }
    else {
        timeToNext = newFrequency - (timeDiff % newFrequency);        
        nextTrain = moment().add(timeToNext, "minutes").format("hh:mm A");

        newRow.addClass("inService");
    };

    // console.log("The next train will arrive in " + timeToNext + " minutes.");
    // console.log("The next train will arrive at " + nextTrain + ".");
    // console.log("---")

    
    newRow.append(
        $("<td class='leftText'>").text(newName),
        $("<td class='leftText'>").text(newDestination),
        $("<td>").text(moment(newStart, "HH:mm").format("hh:mm A")),
        $("<td>").text(newFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(timeToNext)
    );

    // alternate class assignment (for styling) using parity of rowCounter
    if (rowCounter % 2) {
        newRow.addClass("oddRow");
    }
    else {
        newRow.addClass("evenRow");
    };

    rowCounter++;

    $("#trainTable > tbody").append(newRow);

});