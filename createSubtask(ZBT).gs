function addDataToSheet(data) {
  let returnArray = fetchDataSheet();
  var apiKey = returnArray[0];
  var sheetName = returnArray[1]
  var teamId = findTeamId(apiKey)
  var allSpaceId = findSpaceId(teamId, apiKey)
  let allUserId = allUsers(apiKey)

  for (var i = 0; i < allUserId.length; i++) {
    if (allUserId[i].userName == sheetName) {
      var userId = allUserId[i].id;
    };
  }

  data = getTaskGreaterthan4hour(apiKey, allSpaceId, userId)
  console.log(data)
  // Get the sheet by name
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tasks");
  // Clear the entire sheet
  sheet.clear();

  let headers = sheet.getRange("A1:I1");
  headers.setFontColor('White');
  headers.setFontWeight("bold");
  headers.setBackground("#52489C");
  // Set the text wrapping for the range
  headers.setWrap(true);

  // Add header row
  sheet.appendRow(["Task_ID", "Task_Name", "Task_Description", "Task_Status", "Task_Time_Estimate", "Task_Assignee", "Task_Assignee_Id", "Task_List", "Task_List_Id"]);

  // Add data rows
  for (var i = 0; i < data.length; i++) {
    var row = [data[i]["Task_ID"], data[i]["Task_Name"], data[i]["Task_Description"], data[i]["Task_Status"], data[i]["Task_Time_Estimate"], data[i]["Task_Assignee"], data[i]["Task_Assignee_Id"], data[i]["Task_List"], data[i]["Task_List_Id"]];
    sheet.appendRow(row);
  }
}

function createSubtask() {
  let returnArray = fetchDataSheet();
  var apiKey = returnArray[0];
  var sheetName = returnArray[1]
  var teamId = findTeamId(apiKey)
  var allSpaceId = findSpaceId(teamId, apiKey)
  let allUserId = allUsers(apiKey)

  for (var i = 0; i < allUserId.length; i++) {
    if (allUserId[i].userName == sheetName) {
      var userId = allUserId[i].id;
    };
  }
  console.log(apiKey)
  console.log(allSpaceId)
  console.log(userId)
  // Set the API key to access the ClickUp API.
  // var api_test = "pk_61461846_188E1ZLHHMMWCX1URLZIU8R85E3Z6BZO";

  // Get the list of all tasks whose time estimate is greater than 4 hours.
  let allData = getTaskGreaterthan4hour(apiKey, allSpaceId, userId)

  // Loop through each task and create subtasks as needed.
  for (var i = 0; i < allData.length; i++) {
    var singleData = allData[i];
    var totalTime = singleData["Task_Time_Estimate"];
    var list_id = singleData["Task_List_Id"];
    var parent_task_id = singleData["Task_ID"];
    var taskName = singleData["Task_Name"];
    var taskDescription = singleData["Task_Description"];
    var taskStatus = singleData["Task_Status"];
    var taskAssigneesId = singleData["Task_Assignee_Id"];

    // Break down the task into subtasks.
    var subtask_times = break_task(totalTime);
    Logger.log(subtask_times);

    // Loop through each subtask and create it.
    for (var j = 0; j < subtask_times.length; j++) {
      var singleTaskTime = subtask_times[j];
      var url = "https://api.clickup.com/api/v2/list/" + list_id + "/task";
      var query = {
        "custom_task_ids": "true",
        "team_id": "123"
      };
      var payload = {
        "name": taskName + " " + (j + 1),
        "description": taskDescription,
        "status": taskStatus,
        "assignees": [taskAssigneesId],
        "time_estimate": singleTaskTime,
        "start_date_time": false,
        "parent": parent_task_id
      };
      var headers = {
        "Content-Type": "application/json",
        "Authorization": apiKey
      };
      var options = {
        "method": "post",
        "headers": headers,
        "parameters": query,
        "payload": JSON.stringify(payload),
      };
      var response = UrlFetchApp.fetch(url, options);

      // Parse the response to get the subtask data and update the main task.
      let createSubtaskData = JSON.parse(response.getContentText());
      let updateMainTask = updateTaskTime(parent_task_id, apiKey);
      Logger.log(createSubtaskData)
      Logger.log(updateMainTask)
      Logger.log("done");
      Logger.log("------------------------------------------------------------------------------------------------------------");
    }
  }
}


// This function will fetch Name of the sheet and apikey from sheet 
function fetchDataSheet() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  let allSheetName = []
  for (var i = 0; i < sheet.length; i++) {
    var name = sheet[i].getName();
    // Logger.log("Sheet name: " + name);
    allSheetName.push(name)

  }
  // console.log(sheetName)
  let sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(allSheetName[1]);
  let apiKey = sheet2.getRange(1, 2).getValue()
  let returnArray = [apiKey, allSheetName[1]]
  // var sheetName = sheet.getName();
  // console.log(apiKey);
  // // userData = allUsers();
  // console.log(sheetName)
  return returnArray

}


// This function breaks down the total time of a task into subtasks of 4 hours or less.
function break_task(totalTime) {
  let subtask_time = 4.0;
  let num_subtasks = Math.floor(totalTime / subtask_time);
  let remaining_time = totalTime % subtask_time;
  let subtasks = [];

  for (var i = 0; i < num_subtasks; i++) {
    subtasks.push(subtask_time);
  }

  if (remaining_time > 0) {
    subtasks.push(remaining_time);
  }

  let subtasks_in_ms = subtasks.map(function (subtask) {
    return parseInt(subtask * 60 * 60 * 1000);
  });

  return subtasks_in_ms;
}

// This function updates the main task time estimate.
function updateTaskTime(taskId, api_key) {
  // Construct the URL for the API request.
  let url = "https://api.clickup.com/api/v2/task/" + taskId;

  // Set the query parameters for the API request.
  let query = {
    "custom_task_ids": "true",
    "team_id": "123"
  };

  // Set the request body (payload) for the API request.
  let payload = {
    "time_estimate": 0,
  };

  // Set the headers for the API request.
  let headers = {
    "Content-Type": "application/json",
    "Authorization": api_key
  };

  // Set the options for the API request.
  let options = {
    "method": "put",
    "headers": headers,
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true,
    "params": query
  };

  // Send the API request and get the response.
  let response = UrlFetchApp.fetch(url, options);

  // Parse the response data and return it.
  let data = JSON.parse(response.getContentText());
  return data;
}


// This function find task by single user whos task is greater than 4 hours and return the dictionary.
function getTaskGreaterthan4hour(apiKey, allSpaceId, userId) {

  allTaskGreaterthan4Hour = []
  let check_task_time = 14400000;
  for (var i = 0; i < allSpaceId.length; i++) {
    var spaceId = allSpaceId[i].SpaceId;
    Logger.log("Space ID: " + spaceId);

    let url = "https://api.clickup.com/api/v2/space/" + spaceId + "/folder";
    let query = { "archived": "false" };
    let headers = { "Authorization": apiKey };
    let response = UrlFetchApp.fetch(url, { method: "get", headers: headers, "query": query });
    let data = JSON.parse(response.getContentText());

    for (let i = 0; i < data["folders"].length; i++) {
      for (let k = 0; k < data["folders"][i]["lists"].length; k++) {
        let url = "https://api.clickup.com/api/v2/list/" + data["folders"][i]["lists"][k]["id"] + "/task";
        // Set the query parameters and headers for the API request
        let params = {
          "archived": "false"
        };
        let headers = {
          "Content-Type": "application/json",
          "Authorization": apiKey
        };

        // Send the API request and store the response in a variable
        let options = {
          "method": "get",
          "headers": headers,
          "params": params
        };
        let response = UrlFetchApp.fetch(url, options);
        let taskData = JSON.parse(response.getContentText());
        for (let i = 0; i < taskData["tasks"].length; i++) {
          var task = taskData["tasks"][i];
          for (let j = 0; j < task["assignees"].length; j++) {
            var asign = task["assignees"][j];
            if (asign["id"] == userId) {
              if (task["time_estimate"] == null) {
                Logger.log("There is no task Estimation");
              } else if (task["time_estimate"] == check_task_time) {
                Logger.log("Task estimation time is 4hrs");
              } else if (task["time_estimate"] > check_task_time) {
                Logger.log("yes, task time estimation is greater than 4hrs");
                let milliseconds = task["time_estimate"];
                let hours = milliseconds / (1000 * 60 * 60);
                console.log(hours);
                allTaskGreaterthan4Hour.push({
                  "Task_ID": task["id"],
                  "Task_Name": task["name"],
                  "Task_Description": task["description"],
                  "Task_Status": task["status"]["status"],
                  "Task_Time_Estimate": hours,
                  "Task_Assignee": task["assignees"][0]["username"],
                  "Task_Assignee_Id": task["assignees"][0]["id"],
                  "Task_List": task["list"]["name"],
                  "Task_List_Id": task["list"]["id"]
                });
              } else {
                Logger.log("Task time estimation is below 4hrs");
              }
            }
          }
        }
      }
    }
    return allTaskGreaterthan4Hour
  }
}

// This function find all the user in team.
function allUsers(apiKey) {
  let url = "https://api.clickup.com/api/v2/team";
  let headers = {
    "Authorization": apiKey
  };
  let options = {
    "method": "get",
    "headers": headers
  };
  let response = UrlFetchApp.fetch(url, options);
  let data = JSON.parse(response.getContentText());
  // Logger.log(data['team']['members']);

  let teamId = data["teams"][0]["id"];
  let teamName = data["teams"][0]["name"];
  let members = data["teams"][0]["members"];

  // Create an array to hold the array of dictionaries
  let users_array = [];

  // Iterate through the members and create a dictionary for each user
  for (let i = 0; i < members.length; i++) {
    let member = members[i];
    let user_dict = {
      "userName": member["user"]["username"],
      "id": member["user"]["id"],
      "email": member["user"]["email"]
    };
    // Add the user dictionary to the array in the users_array
    users_array.push(user_dict);
  }
  // console.log(users_array)
  return users_array
}

// This function find the spaceId
function findSpaceId(teamId, apiKey) {
  // Construct the API URL for retrieving team spaces
  let url = "https://api.clickup.com/api/v2/team/" + teamId + "/space";

  // Define query parameters for the API request
  let query = {
    "archived": "false"
  };

  // Set the headers for the API request, including the authentication token
  let headers = {
    "Authorization": apiKey
  };

  // Set the options for the API request, including the HTTP method, headers, and query parameters
  let options = {
    "method": "get",
    "headers": headers,
    "params": query,
  };

  // Make the API request and store the response
  let response = UrlFetchApp.fetch(url, options);

  // Parse the response data as JSON
  let data = JSON.parse(response.getContentText());
  let spaceIdDict = []
  // Loop through the array of spaces in the response data and log the ID and name of each space
  for (var i = 0; i < data.spaces.length; i++) {
    // Logger.log(data.spaces[i].id);
    // Logger.log(data.spaces[i].name);
    spaceIdDict.push({ "SpaceId": data.spaces[i].id, "SpaceName": data.spaces[i].name })
  }
  return spaceIdDict
}

// This function find the team Id .
function findTeamId(apiKey) {

  // Set the URL to fetch the data for the teams on ClickUp
  let url = "https://api.clickup.com/api/v2/team";

  // Set the headers for the request
  let headers = { "Authorization": apiKey }

  // Set the options for the request
  let options = {
    "method": "get",
    "headers": headers
  };

  // Fetch the response using UrlFetchApp
  let response = UrlFetchApp.fetch(url, options);

  // Parse the JSON data of the response
  var data = JSON.parse(response.getContentText());

  // Get the team ID and team name from the response data
  let teamId = data["teams"][0]["id"]
  let teamName = data["teams"][0]["name"]

  // Log the team ID and team name
  // Logger.log(teamId)
  // Logger.log(teamName)
  return teamId
}