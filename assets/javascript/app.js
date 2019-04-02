// Initialize Firebase
const config = {
  apiKey: "AIzaSyCZadEFuYcFCRHYvFy8nHU9TSyBprqBwO4",
  authDomain: "train-scheduler-63ffd.firebaseapp.com",
  databaseURL: "https://train-scheduler-63ffd.firebaseio.com",
  projectId: "train-scheduler-63ffd",
  storageBucket: "train-scheduler-63ffd.appspot.com",
  messagingSenderId: "154852066460"
}

firebase.initializeApp(config)

let db = firebase.firestore()

// console.log(currentTime)

document.querySelector(`#submit`).addEventListener(`click`, e => {
  e.preventDefault()
  let id = db.collection(`submissions`).doc().id
  let trainName = document.querySelector(`.train-name`).value
  let destination = document.querySelector(`.destination`).value
  let firstTime = document.querySelector(`.train-time`).value
  let frequency = document.querySelector(`.frequency`).value
  if (trainName === `` || destination === `` || firstTime === `` || frequency === ``) {
    alert(`Please fill out the form entirely!`)
  } else {
    db.collection(`submissions`).doc(id).set({
      trainName: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
    })
    document.querySelector(`.train-name`).value = ``
    document.querySelector(`.destination`).value = ``
    document.querySelector(`.train-time`).value = ``
    document.querySelector(`.frequency`).value = ``
  }
})

db.collection(`submissions`).onSnapshot(snap => {
  document.querySelector(`.schedule`).innerHTML = `
  <tr id="schedhead">
      <th>Train Name</th>
      <th>Destination</th>
      <th>Frequency (min)</th>
      <th>Next Arrival</th>
      <th>Minutes Away</th>
    </tr>
  `
  snap.docs.forEach(doc => {
    let { trainName, destination, firstTime, frequency } = doc.data()
    let currentTime = moment().valueOf()
    let addTime = (frequency * 60 * 1000)
    let nextArrival = currentTime + addTime
    let newTime = new Date(nextArrival)
    let minutesAway = (Math.floor(moment(newTime).valueOf() - currentTime) / 60000) 
    let newElem = document.createElement(`tr`)
    newElem.innerHTML = `
    <td>${ trainName}</td>
      <td>${ destination}</td>
      <td>${ frequency}</td>
      <td>${newTime.toLocaleTimeString()}</td>
      <td>${minutesAway}</td>
    `
    document.querySelector(`.schedule`).append(newElem)
  })
})