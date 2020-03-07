groupID=-1;

function createXmlHttp() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!(xmlhttp)) {
        alert("Your browser does not support AJAX!");
    }
    return xmlhttp;
}

// this function converts a simple key-value object to a parameter string.
function objectToParameters(obj) {
    var text = '';
    console.log("ENTERING");
    for (var i in obj) {
        // encodeURIComponent is a built-in function that escapes to URL-safe values
        text += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&';
    }
    return text;
}


function postParameters(xmlHttp, target, parameters) {
    if (xmlHttp) {
        xmlHttp.open("POST", target, true); // XMLHttpRequest.open(method, url, async)
        var contentType = "application/x-www-form-urlencoded";
        xmlHttp.setRequestHeader("Content-type", contentType);
        xmlHttp.send(parameters);
    }
}

function sendJsonRequest(parameterObject, targetUrl, callbackFunction) {
    var xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            var myObject = JSON.parse(xmlHttp.responseText);
            callbackFunction(myObject, targetUrl, parameterObject);
        }
    }
    console.log(targetUrl);
    console.log(parameterObject);
    temp = objectToParameters(parameterObject);
    console.log(temp);
    postParameters(xmlHttp, targetUrl, temp);
}

function makeGroup() {
    var parameters = {
        'username': "DUMMY"
    };
    sendJsonRequest(parameters, '/make_group_post', function(result, targetUrl, params) {
        console.log(result);
        document.getElementById("content").innerHTML = "Your group code is " + result.id;
        groupID=result.id;
        document.getElementById("buttonHolder").innerHTML='<button onclick="deleteGroup()">Delete Group</button>';
    })
}

function deleteGroup(){
        var parameters = {
        'ID': groupID
    };
    groupID=-1;
    sendJsonRequest(parameters, '/delete_group_post', function(result, targetUrl, params) {
        console.log(result);
        document.getElementById("content").innerHTML = "Group Deleted";
        document.getElementById("buttonHolder").innerHTML='<button onclick="makeGroup()">Make Group</button>';
    });
}

function joinGroup(){
    var parameters = {
        'ID': document.getElementById("groupNumber").value,
        'player': "DUMMY PLAYER"
    };

    groupID = document.getElementById("groupNumber").value;
    sendJsonRequest(parameters, '/join_group_post', function(result, targetUrl, params){
        console.log(result);
        document.getElementById("content").innerHTML = "Joined Group "+result.id+"\nCurrent players: "+result.players;
        document.getElementById("buttonHolder").innerHTML = '<button onclick="leaveGroup()">Leave Group</button>'
    });

function leaveGroup(){
        var parameters = {
        'ID': groupID,
        'player': "DUMMY PLAYER"
    };

    groupID=-1;
    sendJsonRequest(parameters, '/join_group_post', function(result, targetUrl, params){
        console.log(result);
        document.getElementById("content").innerHTML = "You have left the group";
        document.getElementById("buttonHolder").innerHTML = '<label for="groupNumber">Group Code: </label>\n<input type="text" id="groupNumber" name="groupNumber"> </br>\n<button onclick="joinGroup()">Join Group</button>'
    });
}

}