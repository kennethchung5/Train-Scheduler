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


$("form").on("submit", function(event) {
    event.preventDefault();

    var newEntry = {
        name: $("#nameInput").val().trim(),
        destination: $("#destinationInput").val().trim(),
        frequency: $("#frequencyInput").val().trim(),
        start: $("#startInput").val().trim()
    };

    database.ref().push(newEntry);

    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#frequencyInput").val("");
    $("#startInput").val("");

});

database.ref().on("child_added", function(snapshot) {

    //** REVISIT TIME CALCULATION

    var newName = snapshot.val().name;
    var newDestination = snapshot.val().destination;
    var newFrequency = snapshot.val().frequency;
    var newStart = snapshot.val().start;

    console.log("newFrequency: " + newFrequency);
    console.log("newStart: " + newStart);

    // var newStartConverted = moment(newStart, "HH:mm").subtract(1, "years");
    var newStartConverted = moment(newStart, "HH:mm");
    console.log("newStartConverted: " + newStartConverted);

    var currentTime = moment();
    console.log("currentTime (formatted): " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(newStartConverted), "minutes");
    console.log("diffTime: " + diffTime);
    
    var tRemainder = diffTime % newFrequency;
    console.log("tRemainder: " + tRemainder);

    var timeToNext = newFrequency - tRemainder;
    console.log("timeToNext: " + timeToNext);

    var nextTrain = moment().add(timeToNext, "minutes");
    console.log("nextTrain (formatted): " + moment(nextTrain).format("hh:mm"));
    console.log("----")
   

    

})