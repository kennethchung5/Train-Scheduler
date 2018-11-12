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

    // validate input: 1. nameInput and destinationInput are not blank 2. startInput is in "HH:mm" format 3. frequencyInput is an integer (technically a string, but equal in value) 
    var nameInputCheck = $("#nameInput").val().trim();
    var destinationInputCheck = $("#destinationInput").val().trim();
    var startInputCheck = $("#startInput").val().trim();
    var frequencyInputCheck = $("#frequencyInput").val().trim();
    
    // if any rejection condition is met, then alert the user, clear the bad value, and set focus on that input field
    // proceed with pushing an object to database only if the inputs clear the checks
    if (nameInputCheck == "") {
        alert("Please enter a Train Name; this cannot be blank.");
        $("#nameInput").val("");
        $("#nameInput").focus();
    }
    else if (destinationInputCheck == "") {
        alert("Please enter a Destination; this cannot be blank.");
        $("#destinationInput").val("");
        $("#destinationInput").focus();
    }
    else if (moment(startInputCheck, "HH:mm", true).isValid() === false) {
        alert('Invalid input detected for "First Train Time" field! Please enter the time in 24-hr format (HH:mm).');
        $("#startInput").val("");
        $("#startInput").focus();
    }
    else if (frequencyInputCheck != parseInt(frequencyInputCheck)) {
        alert('Invalid input detected for "Frequency" field! Please enter the frequency (in minutes) as an integer.');
        $("#frequencyInput").val("");
        $("#frequencyInput").focus();
    }
    else {
        var newEntry = {
            name: nameInputCheck,
            destination: destinationInputCheck,
            start: startInputCheck,
            frequency: frequencyInputCheck
        };

        database.ref().push(newEntry);

        $("#nameInput").val("");
        $("#destinationInput").val("");
        $("#startInput").val("");
        $("#frequencyInput").val("");

        $("#nameInput").focus();
    };
    
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