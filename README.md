# Train-Scheduler

https://kennethchung5.github.io/Train-Scheduler/

This is an interactive app written in JavaScript with jQuery. The app is linked to a Firebase realtime database and uses the Moment.js library to perform calculations with time. 

The app features a table displaying these data about (fictitious) train lines: name, destination, initial train time, frequency (the regular interval between trains of the line), time of the next train, and time until the next train. The Firebase database stores the first four of these fields. Given the initial time and frequency, and considering the current time, the app derives the last two fields. The last two fields are therefore dynamic and do not need to be stored. 

The interface also features a form that allows the user to add train line entries. The user submits the four fields that define a train line, and the app has mechanisms for validating the format of the input. Successfully submitting the form pushes a new object to the Firebase database, which in turn appends a new row to the table in all sessions of the app. 

One complication I encountered while developing this app was handling the scenario of an initial train time later than the current time; the calculation process I used for currently-running trains could not be applied here, since subtracting the initial train time from the current time results in a negative difference. For simplicity, I assumed that the train schedules would not continue across days (from PM to AM), so that a line's initial train would in fact be the first running train of the calendar day, and not merely a reference point from which to determine other trains of the line. Once I made this decision, determining the next train for a line whose initial train is later in the day was simple: the next train is the initial train (this is the only scenario in which the time until the next train can exceed the frequency). I assigned classes for CSS styling so that the display clearly distinguishes between train lines that are currently running and those that start later in the day. 
