const blockSize=25;
var playerList;
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
        playerList=result.players;
        document.getElementById("content").innerHTML = "Your group code is " + result.id + "\nPlayer list: " + playerList;
        document.getElementById("map_names").style.display = "block";
        groupID=result.id;
        document.getElementById("buttonHolder").innerHTML='<button onclick="deleteGroup()">Delete Group</button>';
        buildCanvas(20, 20);
        document.getElementById("map").style.display="block";

        setInterval(leaderPoll, 3000); //Poll once every 3 seconds

    })
}

function leaderPoll(){ //Any polling to be done on the DM side.  Also updates the map automatically.

    if(groupID==-1) return;  //No idea how to end a setInterval, so we just don't do anything if we don't have a gid

    var parameters = {
        'ID': groupID,
        'map': document.getElementById("map").toDataURL(), // might need to be json.dumps(map.toDataURL)
        'height': document.getElementById("map").height, //this needs changed (I think its in pixels rn?)
        'width': document.getElementById("map").width
    };

    sendJsonRequest(parameters, '/leader_poll', function(result, targetUrl, params) {
        console.log(result);
        if(JSON.stringify(playerList)==JSON.stringify(result.players))  return; //No change in the player list.
        playerList=result.players;
        document.getElementById("content").innerHTML = "Your group code is " + result.id + "\nPlayer list: " + playerList;
    })
}

function playerPoll(){ //Any polling to be done on the player side.

    if(groupID==-1) return;  //No idea how to end a setInterval, so we just don't do anything if we don't have a gid

    var parameters = {
        'ID': groupID,
    };

    sendJsonRequest(parameters, '/player_poll', function(result, targetUrl, params) {
        console.log(result);
        if(JSON.stringify(playerList)==JSON.stringify(result.players) && result.map==document.getElementById("map").toDataURL())  return; //No change in the player list or map.
        playerList=result.players;
        document.getElementById("content").innerHTML = "Joined Group " + result.id + "\nCurrent Players: " + playerList;
        
        canvas = document.getElementById("map");

        canvas.height=result.height;
        canvas.width=result.width;

        var ctx=canvas.getContext("2d"); //Update the map

        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = result.map;
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
        document.getElementById("map").style.display="none";
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
        document.getElementById("buttonHolder").innerHTML = '<button onclick="leaveGroup()">Leave Group</button>';

        var ctx=document.getElementById("map").getContext("2d"); //Get the map
        
        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = result.map;

        document.getElementById("map").style.display="block";

        setInterval(playerPoll, 3000);
    });
}

function leaveGroup(){
        var parameters = {
        'ID': groupID,
        'player': "DUMMY PLAYER"
    };

    sendJsonRequest(parameters, '/leave_group_post', function(result, targetUrl, params){
        console.log(result);
        document.getElementById("content").innerHTML = "You have left the group";
        document.getElementById("map").style.display="none";
        document.getElementById("buttonHolder").innerHTML = '<label for="groupNumber">Group Code: </label>\n<input type="text" id="groupNumber" name="groupNumber"> </br>\n<button onclick="joinGroup()" value="'+groupID+'">Join Group</button>'
    });
}

function buildCanvas(height, length, map){


        board=new Array(height);

        /*
        //Rows
        for(var i=0; i<height; i++){
            board[i]=new Array(length);
            //Cols
            for(var z=0; z<length; z++){
                board[i][z]=0;
            }
        }
    */

    var canvas=document.getElementById("map");
    canvas.width=blockSize*length;
    canvas.height=blockSize*height;

    var ctx=canvas.getContext("2d");
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();


    ctx.strokeStyle="white";
    for(var i=0; i<=canvas.width; i=i+blockSize){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    for(var i=0; i<=canvas.height; i=i+blockSize){
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    if (map != null){
        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = map;
    }
}

function loadCanvas(key){

    var parameters = {
        'key': key
    };

    sendJsonRequest(parameters, '/retrievegrid', function(result, targetUrl, params) {

        length = result.length;
        height = result.height;
        map = JSON.parse(result.map);
        console.log("hi");

        board=new Array(height);

        var canvas=document.getElementById("map");
        canvas.width=blockSize*length;
        canvas.height=blockSize*height;

        var ctx=canvas.getContext("2d");
        for(var i=0; i<=canvas.width; i=i+blockSize){
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        for(var i=0; i<=canvas.height; i=i+blockSize){
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = map;
        console.log("hi2")
    });
}

function filesystem(maps) {
    var sortedMaps = maps.sort((a, b) => (a.campaign > b.campaign) ? 1 : -1)

    var myHTML = "";
    var curCampaign = sortedMaps[0].campaign;
    myHTML = myHTML + "<label for="+curCampaign+">"+curCampaign+"</label>\n";
    myHTML = myHTML + "<select id="+curCampaign+">\n";

    for (m in sortedMaps) {
        if (m.campaign = curCampaign){
            myHTML = myHTML + "<option value="+m.map_name+">"+m.map_name+"</option>\n";
        }
        else {
            myHTML = myHTML + "</select>\n";
            curCampaign = m.campaign;
            myHTML = myHTML + "<label for="+curCampaign+">"+curCampaign+"</label>\n";
            myHTML = myHTML + "<select id="+curCampaign+">\n";
            myHTML = myHTML + "<option value="+m.map_name+">"+m.map_name+"</option>\n";
        }
    }
    myHTML = myHTML + "</select>\n";


    document.getElementById("map_names").innerHTML = myHTML;
}