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

    var newTrainName = $("#trainNameInput").val().trim();
    var newDestination = $("#destinationInput").val().trim();
    var newFrequency = $("#frequencyInput").val().trim();
    var newFirstTrain = $("#firstTrainInput").val().trim();

    var newEntry = {
        trainName: newTrainName,
        destination: newDestination,
        frequency: newFrequency,
        firstTrain: newFirstTrain
    };

    database.ref().push(newEntry);

    $("#trainNameInput").text("");
    $("#destinationInput").text("");
    $("#frequencyInput").text("");
    $("#firstTrainInput").text("");

});

database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());

    // record firebase values in variables
    // perform arithmetic operations using moment()
    // display in html

    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;

})