//Userlist data array for filling in info box
var userListData = [];

//DOM Ready ======================================
$(document).ready(function(){

    //Populate the user table on initial page load
    populateTable();
});

//Functions

//Fill Table with data
function populateTable(){

    //empty content string
    var tableContent = '';

    //jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        //Stick user data array into a userlist variable in the global object
        userListData = data;
        //for each item in the JSON, add a tableitem
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '<a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href = "#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        //Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
        //Add the clicker for the table
        $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
        //Add User button click
        $('#btnAddUser').on('click', addUser);
        //Delete User Link
        $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    });
};

//Show user info

function showUserInfo( event ){
    //prevent link from flaring
    event.preventDefault();

    //retreive username from link rel default
    var thisUserName = $(this).attr('rel');

    //Get index of an object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    //Get  user Object     
    var thisUserObject = userListData[arrayPosition];
    
    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

//Add User
function addUser(event) {
    event.preventDefault();

    //Super basic validation - increase errorcount Variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val){
        if($(this).val() === '') {errorCount++;}
    });

    //Check and make sure errorCount is still at zero
    if(errorCount === 0 ){

        //if it is, compile all user info into a single object
        var newUser = {
            'username' : $('#addUser fieldset input#inputUserName').val(),
            'email' : $('#addUser fieldset input#inputUserEmail').val(),
            'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
            'age' : $('#addUser fieldset input#inputUserAge').val(),
            'location' : $('#addUser fieldset input#inputUserLocation').val(),
            'gender' : $('#addUser fieldset input#inputUserGender').val()
        }

        //Use AJAX to post object to the adduser object

        $.ajax({
            type : 'POST',
            data : newUser,
            url : '/users/adduser',
            dataType : 'JSON'
        }).done(function( response ){

            //Check for successful (blank) response
            if (response.msg === ''){

                //Clear form inputs
                $('#addUser fieldset input').val('');

                //Update the table
                populateTable();
            }
            else{

                //If something goes wrong, alert the error message that our service returned
                alert('Error: '+ response.msg);
            }
        });
    }
    else{
        //If error count is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

//Delete User
 function deleteUser(event) {
     event.preventDefault();
     //Pop up a confirmation dialog
     //Make sure the user confirmed
     if (confirm('Are you sure you want to delete this user?')){
         //if they did , delete the user
         $.ajax({
             type: 'DELETE',
             url: '/users/deleteuser/' + $(this).attr('rel')}).done(function( response ) {
                //Check for a successful (blank) response
                if (response.msg === ''){
                    //Do nothing?
                }
                else{
                    alert('Error: '+response.msg);
                }
                //Update the table
                populateTable();
         });
     }
     else{
         //If they said no to the confirm also do nothing
         return false;
     }
 };

 //Update User
//  function updateUser(event){
//     event.preventDefault();
//     $.ajax({
//         type : 'PUT',
//         url : '/users/updateuser/' + $(this).attr('rel')}).done(function( response ){
//             //Check for a successful(blank) response 
//             if( response.msg == ''){
//                 //It worked take no action
//             }
//             else{
//                 alert("Error: " + response.msg );
//             }
//             //update the table
//             populateTable();
//         });
//  }