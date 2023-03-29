<h1 align="center">
    <b>Google Sheets and ClickUp Integration: Create subtasks for tasks exceeding 4 hours</b> 
<br>
</h1>

## Description
This repository will help you to identify tasks that are greater than 4 hours in duration in a Google Sheet. You can then create subtasks based on these tasks.

## Instruction
To use this repository, follow these steps:

1. Create a folder in Google Drive and then create a Google Sheet inside that folder.
2. Open the sheet and add two sheets. Change the name of the first sheet to ```tasks``` and change the name of the second sheet to your ```ClickUp username```.
    <p align="center">
    <img src="https://github.com/BishanSingh246/Google-Sheets-and-ClickUp-Integration-Create-subtasks-for-tasks-exceeding-4-hours/blob/main/Img/Screenshot%202023-03-29%20075714.jpg?raw=true" alt="Login">
    </p>
3. In the second sheet, add your ClickUp API key. 
    <p align="center">
    <img src="https://github.com/BishanSingh246/Google-Sheets-and-ClickUp-Integration-Create-subtasks-for-tasks-exceeding-4-hours/blob/main/Img/Screenshot%202023-03-29%20075921.jpg?raw=true" alt="Login">
  </p>
    
4. To create an API key, follow these steps:
    1. Login to your ClickUp account.
    2. Click on your avatar icon in the bottom left corner.
    3. Click on ```My Settings```.
    4. Click on ```Apps``` from the left-hand menu.
    5. Click on the ```Generate``` button to generate a new API key.
  
5. Click on ```Extensions``` in the menu bar. Select ```Google Apps Script``` from the dropdown menu. This will open a new window with the ```Google Apps Script``` editor.
6. Add a file with any name in the ```Google Apps Script``` editor.
7. Copy the code from the ```createSubtask(ZBT).gs``` file from this repository and paste it into your file in the ```Google Apps Script``` editor. Then, save your file.
8. Open the sheet and click on ```Extensions``` in the menu bar, then select ```Macros``` from the dropdown menu. Click on ```Import macro``` to add function to ```Macros```.
9. Find the two functions ```addDataToSheet``` and ```createSubtask``` and click on ```Add Function``` to add the functions to ```Macros```.


## Running the Function

To run the function added in ```Macros```:

1. Click on ```Extensions``` in the menu bar.
2. Select ```Macros``` from the dropdown menu.
3. Click on ```addDataToSheet``` from the dropdown menu. This will add all the tasks of the user for which time estimation is greater than 4 hours to a sheet named ```tasks```. If there are no tasks that meet this criteria, nothing will be shown.
4. Click on ```createSubtask``` from the dropdown menu. This will create a subtask inside a task that will show in the ```tasks``` sheet.
