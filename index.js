function createEmployeeRecord(array){
    // first name STRING, family name STRING, title STRING, payrate per hour NUMBER
    const recordObj = {
        firstName: array[0],
        familyName: array[1],
        title: array[2],
        payPerHour: array[3],
        timeInEvents: [],
        timeOutEvents: [],
    }
    return recordObj
}


function createEmployeeRecords(nestedArray){
    const result =[]
    nestedArray.forEach(array => result.push(createEmployeeRecord(array)))
    return result
}

function createTimeInEvent(employObj, dateStamp){
    // dateStamp = YYYY-MM-DD HHMM string
    //             0123456789 1234
    //                      10

    const timeObj = {
        type: "TimeIn",
        hour: parseInt(dateStamp.slice(-4),10), // need to count backwards to deal with single or double digit hours and explictly convert to Int
        date: dateStamp.slice(0,10) // (YYYY-MM-DD)
    }

    return employObj.timeInEvents.push(timeObj) //time[action]Events is an array, hence the use of push
}

function createTimeOutEvent(employObj, dateStamp){
    // similar as timeIn, but for timeOut
    const timeObj = {
        type: "TimeOut",
        hour: parseInt(dateStamp.slice(-4),10),
        date: dateStamp.slice(0,10) // (YYYY-MM-DD)
    }
    
    return employObj.timeOutEvents.push(timeObj)
}


function hoursWorkedOnDate(employObj, dateStamp){
    // from test, it appears i need to search the timeObj's date. if it's a hit, capture hours

    const timeInValue = employObj.timeInEvents.find(element => element.date === dateStamp).hour // chaining .hour works here because single element returns
    const timeOutValue = employObj.timeOutEvents.find(element => element.date === dateStamp).hour

    return (timeOutValue - timeInValue)/100   //hours is in 100 units. 

}

function wagesEarnedOnDate(employObj, dateStamp){
    return hoursWorkedOnDate(employObj, dateStamp) * employObj.payPerHour
}


function allWagesFor(employObj){
    const timeInArray = employObj.timeInEvents.filter(element => element.type === "TimeIn")
    const timeOutArray = employObj.timeOutEvents.filter(element => element.type === "TimeOut")
    
    const timeInandOutArray = []

    for (let i = 0; i < timeInArray.length; i++){
        timeInandOutArray.push([timeOutArray[i].hour,timeInArray[i].hour])    //i could have probably done the hoursOut - hoursIn here
    }                                                                         // but doing it in next code block for easier read and following

    const totalHours = timeInandOutArray.reduce( (accumulator, pairElement) => {
        return (pairElement[0] - pairElement[1]) + accumulator
    }, 0)

    return totalHours * employObj.payPerHour / 100

}

function calculatePayroll(arrayOfObj){

    const totalHours = arrayOfObj.map(employObj => allWagesFor(employObj)) // why does the lab instruct us to use wagesEarnedOnDate? using allWages is better
    return totalHours.reduce((accum, element) => accum + element)          // unless this impacts the optional part?
}

