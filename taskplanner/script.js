var templateDiv = document.getElementById("templateDiv")
var assignmentsCreationDiv = document.getElementById("assignmentsCreationDiv")
var submitButton = document.getElementById("Submit")
var saveButton = document.getElementById("Save")
var input = document.getElementById("assignment")
var text = document.getElementById("text")
var dueDate = document.getElementById("due date")
var dueTime = document.getElementById("time")
var assignmentsDiv = document.getElementById("assignmentsDiv")
var selectTemplate = document.getElementById("templates")
var existingTemplates = document.getElementById("existingTemplates")
var assignments = []
var templates = []
var selectTemplateValue = ""
var steps = []
var checkboxStatuses = []

var valueForProgressBar = function (startingDate, startingTime) {
  var startDate = new Date()
  var splitStartingDate = [startingDate.split("/"), startingTime.split(":")]
  startDate.setFullYear(splitStartingDate[0][2])
  startDate.setMonth(splitStartingDate[0][0] - 1)
  startDate.setDate(splitStartingDate[0][1])
  startDate.setHours(splitStartingDate[1][0])
  startDate.setMinutes(splitStartingDate[1][1])
  startDate.setSeconds(splitStartingDate[1][2])
  var millisecondsFrom1970ToStartingDate = startDate.getTime()
  var today = new Date()
  var millisecondsFrom1970ToNow = today.getTime()
  var value = (millisecondsFrom1970ToNow - millisecondsFrom1970ToStartingDate) / 1000
  return value
}

var showList = function () {
  var visualLookOfTheAssignments = []
  var progressBarIds = []
  for (var i = 0; i < assignments.length; i++) {
    progressBarIds.push("progress." + i)
    visualLookOfTheAssignments.push(assignments[i][0] + ", " + assignments[i][2] + ", " + assignments[i][4])
    visualLookOfTheAssignments.push('<progress id="progress.' + i + '" value="' + valueForProgressBar(assignments[i][1], assignments[i][3]) + '"></progress>')
    visualLookOfTheAssignments.push('<button id="Done.' + i + '" class="buttonDone btn btn-warning">Done</button>')
    if (assignments[i][5] != "None") {
      steps = deserialize1DArrays(assignments[i][5])
      if (checkboxStatuses.length <= i) {
        var listy = []
        for (var j = 0; j < steps.length; j++) {
          visualLookOfTheAssignments.push("<input type='checkbox' id='checkbox."+i+"."+j+"'><label for='checkbox."+i+"."+j+"'>"+steps[j]+"</label>")
          listy.push("unchecked")
        }
        checkboxStatuses.push(listy)
      }
      else {
        for (var k = 0; k < steps.length; k++) {
          if (checkboxStatuses[i][k] === "checked") {
            visualLookOfTheAssignments.push("<input type='checkbox' id='checkbox."+i+"."+k+"' checked><label for='checkbox."+i+"."+k+"'>"+steps[k]+"</label>")
          }
          else {
            visualLookOfTheAssignments.push("<input type='checkbox' id='checkbox."+i+"."+k+"'><label for='checkbox."+i+"."+k+"'>"+steps[k]+"</label>")
          }
        }
      }
    }
    else {
      checkboxStatuses.push([])
    }
  }
  if (templates.length > 0) {
    selectTemplateValue = selectTemplate.value
    selectTemplate.options.length = 0
    var defaultOption = document.createElement("option")
    defaultOption.text = "Select a template to use"
    defaultOption.value = "defaultOption"
    selectTemplate.add(defaultOption)
    for (var i = 0; i < templates.length; i++) {
      var option = document.createElement("option")
      option.text = templates[i]
      option.value = templates[i]
      selectTemplate.add(option)
    }
  }
  text.innerHTML = visualLookOfTheAssignments.join("<br>")
  var buttons = document.getElementsByClassName("buttonDone")
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      var buttonId = event.target.id
      var splitId = buttonId.split(".")
      assignments.splice(splitId[1], 1)
      checkboxStatuses.splice(splitId[1], 1)
      serialize2DArrays(assignments, "assignments")
      deserialize2DArrays("assignments")
      serialize2DArrays(checkboxStatuses, "checkboxStatuses")
      deserialize2DArrays("checkboxStatuses")
      showList()
    })
  }
  for (var i = 0; i < progressBarIds.length; i++) {
    loadProgressBar(progressBarIds[i], timeBeforeDueDate(assignments[i][1], assignments[i][3], assignments[i][2], assignments[i][4]))
  }
}

timeToday = function () {
  var today = new Date()
  var hours = String(today.getHours())
  var minutes = String(today.getMinutes())
  var seconds = String(today.getSeconds())
  var time = hours + ":" + minutes + ":" + seconds
  return time
}

dateToday = function () {
  var today = new Date()
  var day = today.getDate()
  var month = today.getMonth() + 1
  var year = today.getFullYear()
  var date = String(month + "/" + day + "/" + year)
  return date
}

submitButton.onclick = function () {
  assignmentsCreationDiv.style.display = "none";
  assignmentsDiv.style.display = "block";
  var dueTimeValue = dueTime.value + ":00"
  if (selectTemplate.value != "Select a template to use") {
    assignments.push([input.value, dateToday(), dueDate.value, timeToday(), dueTimeValue, selectTemplate.value])
  }
  else {
    assignments.push([input.value, dateToday(), dueDate.value, timeToday(), dueTimeValue, "None"])
  }
  serialize2DArrays(assignments, "assignments")
  showList()
  input.value = ""
  dueDate.value = ""
  dueTime.value = ""

}

var addNewStep = function () {
  var inputId = "template.1"
  var divId = "div.1"
  var i = 1
  while (document.getElementById(inputId) != null) {
    i += 1
    inputId = "template." + i
    divId = "div." + i
  }
  var newInput = document.createElement("INPUT")
  newInput.setAttribute("id", inputId)
  newInput.setAttribute("placeholder", "Add step")
  var newDiv = document.createElement("DIV")
  newDiv.setAttribute("id", divId)
  newDiv.appendChild(newInput)
  document.getElementById('inputBoxes').appendChild(newDiv)
}

var removeNewStep = function () {
  var inputBoxesDiv = document.getElementById('inputBoxes')
  var divId = "div.2"
  var i = 2
  while (document.getElementById(divId) != null) {
    i += 1
    divId = "div." + i
  }
  var splitInputId = divId.split(".")
  divId = "div." + parseInt(parseInt(splitInputId[1]) - 1)
  document.getElementById("inputBoxes").removeChild(document.getElementById(divId))
}

var serialize2DArrays = function (thingToSerialize, keyName) {
  var serializedList = []
  for (var i = 0; i < thingToSerialize.length; i++) {
    serializedList.push(thingToSerialize[i].join("\n"))
  }
  serializedList = serializedList.join("\r")
  window.localStorage.setItem(keyName, serializedList)
}

var serialize1DArrays = function (thingToSerialize, keyName) {
  var serializedList = thingToSerialize
  serializedList = serializedList.join("\n")
  window.localStorage.setItem(keyName, serializedList)
}

var deserialize2DArrays = function (keyName) {
  var serializedList = window.localStorage.getItem(keyName)
  if (typeof serializedList === "undefined" || serializedList === null) {
    serializedList = ''
  }
  if (serializedList == '') {
    return []
  }
  var deserializedList = serializedList.split("\r")
  for (var i = 0; i < deserializedList.length; i++) {
    deserializedList[i] = deserializedList[i].split("\n")
  }
  return deserializedList
}

var deserialize1DArrays = function (keyName) {
  var serializedList = window.localStorage.getItem(keyName)
  if (typeof serializedList === "undefined" || serializedList === null) {
    serializedList = ''
  }
  if (serializedList == '') {
    return []
  }
  var deserializedList = serializedList.split("\n")
  return deserializedList
}

var saveTemplate = function () {
  var templateSteps = []
  var inputId = "template.1"
  var i = 1
  while (document.getElementById(inputId) != null) {
    templateSteps.push(document.getElementById(inputId).value)
    i += 1
    inputId = "template." + i
  }
  serialize1DArrays(templateSteps, document.getElementById("templateName").value)
  templates.push(document.getElementById("templateName").value)
  serialize1DArrays(templates, "templates")
  showTemplates()
}

var showTemplates = function() {
  assignmentsDiv.style.display = "none";
  templateDiv.style.display = "block";
  var inputBoxesIds = ["template.1"]
  var modifiedTemplates = []
  for (var i = 0; i < templates.length; i++) {
    var existingTemplate = '<p>'+templates[i]+"</p><button class='deleteTemplate btn btn-warning' id=delete."+i+">-Remove template</button>"
    modifiedTemplates.push(existingTemplate)
  }
  existingTemplates.innerHTML = modifiedTemplates.join('<br>')
  var deleteButtons = document.getElementsByClassName("deleteTemplate")
  for (var j = 0; j < deleteButtons.length; j++) {
    deleteButtons[j].addEventListener("click", function (event) {
      var buttonId = event.target.id
      var splitId = buttonId.split(".")
      var newTemplates = templates
      newTemplates.splice(splitId[1], 1)
      serialize1DArrays(newTemplates, "templates")
      templates = deserialize1DArrays("templates")
      showTemplates()
    })
  } 
}

document.getElementById('addTemplate').onclick = function () {
  showTemplates()
  document.getElementById("addStep").onclick = addNewStep
  document.getElementById("removeStep").onclick = removeNewStep
  document.getElementById("submitTemplate").onclick = saveTemplate
}

document.getElementById('backButton').onclick = function () {
  templateDiv.style.display = "none";
  assignmentsDiv.style.display = "block";
  showList()
}

var getDaysInMonth = function (month) {
  return new Date(2021, month, 0).getDate();
}

var get_Date = function (day, month) {
  var today = new Date(2021, month, day)
  var dayOfTheYear = 0
  for (var i = 1; i < month; i++) {
    dayOfTheYear = dayOfTheYear + getDaysInMonth(i)
  }
  dayOfTheYear = dayOfTheYear + day
  return dayOfTheYear
}

// In this function, you are finding out how much time you have until the due date. To do this,  you are finding out how many seconds it has been from Jan 1, 1970, to now (that's what you are doing when defining millisecondsFrom1970ToStartingDate). Then, you are splitting the given due date into the month, day, and year (ex: if it is ["5/12/2021"] it will become ["5", "12", "2021"]) and you are splitting the given time into its minutes and seconds (ex: ["5:12"] becomes ["5", "12"]). We use the split values to redefine the "today" variable to the due date given, and we use the new "today" to calculate how many seconds it has been from Jan 1, 1970, to the due date. Finally, we subtract the two values to get the amount of time from now until the due date. I'm not sure what "startingTime" and "splitCurrentDate" are for.
var timeBeforeDueDate = function (startingDate, startingTime, assignmentDate, assignmentTime) {
  var startDate = new Date()
  var splitStartingDate = [startingDate.split("/"), startingTime.split(":")]
  startDate.setFullYear(splitStartingDate[0][2])
  startDate.setMonth(splitStartingDate[0][0] - 1)
  startDate.setDate(splitStartingDate[0][1])
  startDate.setHours(splitStartingDate[1][0])
  startDate.setMinutes(splitStartingDate[1][1])
  startDate.setSeconds(splitStartingDate[1][2])
  var millisecondsFrom1970ToStartingDate = startDate.getTime()
  var splitDueDate = [assignmentDate.split("/"), assignmentTime.split(":")]
  var theDueDate = new Date()
  theDueDate.setFullYear(splitDueDate[0][2])
  theDueDate.setMonth(splitDueDate[0][0] - 1)
  theDueDate.setDate(splitDueDate[0][1])
  theDueDate.setHours(splitDueDate[1][0])
  theDueDate.setMinutes(splitDueDate[1][1])
  theDueDate.setSeconds(0)
  var millisecondsFrom1970ToDueDate = theDueDate.getTime()
  var timer = (millisecondsFrom1970ToDueDate - millisecondsFrom1970ToStartingDate) / 1000
  return timer
}

var something = function (progressBarId) {
  var progressBar = document.getElementById(progressBarId)
  if (progressBar == null) {
    return
  }
  progressBar.value += 1
  seperatedBarId = progressBarId.split(".")
  assignmentNumber = parseInt(seperatedBarId[1], 10)
  if (Math.round(progressBar.value) == progressBar.max - 300) {
    alert("You have five minutes remaining to submit assignment " + assignments[assignmentNumber][0])
  }
  if (Math.round(progressBar.value) == progressBar.max - 60) {
    alert("You have one minute remaining to submit assignment " + assignments[assignmentNumber][0])
  }
  if (Math.round(progressBar.value) == progressBar.max) {
    alert("The deadline to submit assignment " + assignments[assignmentNumber][0] + " has been reached. Better turn it in fast!")
  }
  if (progressBar.value < progressBar.max) {
    window.setTimeout(function () {
      something(progressBarId)
    }, 1000)
  }
}

var loadProgressBar = function (progressBarId, max) {
  var progressBar = document.getElementById(progressBarId)
  progressBar.max = max
  window.setTimeout(function () {
    something(progressBarId)
  }, 1000)
}

var checkStatusesOfCheckboxes = function() {
  for (var i = 0; i < checkboxStatuses.length; i++) {
    for (var j = 0; j < checkboxStatuses[i].length; j++) {
      if (document.getElementById("checkbox."+i+"."+j).checked == true){
        checkboxStatuses[i][j] = "checked"
      }
      else {
        checkboxStatuses[i][j] = "unchecked"
      }
    }
  }
  serialize2DArrays(checkboxStatuses, "checkboxStatuses")
  window.setTimeout(function () {
    checkStatusesOfCheckboxes()
  }, 1000)
}

document.getElementById("addAssignment").onclick = function () {
  templateDiv.style.display = "none";
  assignmentsDiv.style.display = "none";
  assignmentsCreationDiv.style.display = "block";
}

document.getElementById("existingAssignments").onclick = function () {
  templateDiv.style.display = "none";
  assignmentsDiv.style.display = "block";
  assignmentsCreationDiv.style.display = "none";
}

templateDiv.style.display = "none";
assignmentsDiv.style.display = "block";
assignmentsCreationDiv.style.display = "none";
assignments = deserialize2DArrays("assignments");
templates = deserialize1DArrays("templates");
checkboxStatuses = deserialize2DArrays("checkboxStatuses")
var startingLength = templates.length
showList();
if (checkboxStatuses.length != 0) {
  window.setTimeout(function () {
    checkStatusesOfCheckboxes()
  }, 1000)
}
