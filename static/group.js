const blocksize=26; //Should be even
var playerList;
const playerColors=["blue", "green", "purple", "yellow", "orange", "pink", "turquoise", "yellowgreen"];
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
        var ret="<h4>Your group code is " + result.id + "</h4>" + "<p>Player list: </p>";
        for(var i=0; i<playerList.length; i++){
            ret=ret+"<span style='color: "+playerColors[i]+";' onclick='setPC(\""+playerColors[i]+"\")'>"+playerList[i]+"</span>";
        }
        document.getElementById("content").innerHTML = ret;
        document.getElementById("map_names").style.display = "block";
        groupID=result.id;
        document.getElementById("buttonHolder").innerHTML='<button class="submit-button btn btn-primary btn-round" onclick="deleteGroup()">Delete Group</button>';
        buildCanvas(20, 20);
        document.getElementById("map").style.display="block";

        //setInterval(leaderPoll, 3000); //Poll once every 3 seconds

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
        playerList=result.players;
        var ret="<h4>Your group code is " + result.id + "</h4>" + "<p>Player list: </p>";
        for(var i=0; i<playerList.length; i++){
            ret=ret+"<span style='color: "+playerColors[i]+";' onclick='setPC(\""+playerColors[i]+"\")'>"+playerList[i]+"</span>";
        }
        console.log("Return value: "+ret);
        document.getElementById("content").innerHTML = ret;
    })
}

function playerPoll(){ //Any polling to be done on the player side.

    if(groupID==-1) return;  //No idea how to end a setInterval, so we just don't do anything if we don't have a gid

    var parameters = {
        'ID': groupID,
    };

    sendJsonRequest(parameters, '/player_poll', function(result, targetUrl, params) {
        console.log(result);
        playerList=result.players;
        var ret="<h4>Joined Group " + result.id + "</h4>" + "Current Players: ";
        for(var i=0; i<playerList.length; i++){
            ret=ret+"<span style='color: "+playerColors[i]+";'>"+playerList[i]+"</span>"
        }
        document.getElementById("content").innerHTML = ret;
        canvas = document.getElementById("holder");  //Our comparison staging area

        canvas.height=result.height;
        canvas.width=result.width;

        var ctx=canvas.getContext("2d"); // Build comparison

        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = result.map;


        //Now, we must compare the staged map and current map

        var newData=ctx.getImageData(0,0,canvas.width, canvas.height);
        canvas=document.getElementById("map");
        ctx=canvas.getContext("2d");
        var oldData=ctx.getImageData(0, 0, canvas.width, canvas.height);

        if(newData.height==oldData.height && newData.width==oldData.width){
            return;
        }
        else{ //Pixel by pixel comparison.
            var flag=0;
            for(var i=0; i<oldData.data.length && !flag; i=i+4){
                var oldHex="#"+("000000"+((oldData[i] << 16) | (oldData[i+1] << 8) | oldData[i+2]).toString(16)).slice(-6);
                var newHex="#"+("000000"+((newData[i] << 16) | (newData[i+1] << 8) | newData[i+2]).toString(16)).slice(-6);

                if(oldHex.localeCompare(newHex)!=0){ //Our pixels are not the same
                    flag=1;
                }
            }

            if(flag==0){
                return;
            }
        }
        //refresh map

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
        document.getElementById("content").innerHTML = "<p>Group Deleted</p>";
        document.getElementById("buttonHolder").innerHTML='<button class="submit-button btn btn-primary btn-round" onclick="makeGroup()">Make Group</button>';
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
        playerList=result.players;
        var ret="<h4>Joined Group " + result.id + "</h4>" + "<p>Current Players: " + "</p>";
        for(var i=0; i<playerList.length; i++){
            ret=ret+"<span style='color: "+playerColors[i]+";'>"+playerList[i]+"</span>"
        }
        document.getElementById("content").innerHTML = ret;
        document.getElementById("buttonHolder").innerHTML = '<button class="submit-button btn btn-primary btn-round" onclick="leaveGroup()">Leave Group</button>';
        document.getElementById("map").height=result.height;
        document.getElementById("map").width=result.width;

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
        document.getElementById("content").innerHTML = "<h4>You have left the group</h4>";
        document.getElementById("map").style.display="none";
        document.getElementById("buttonHolder").innerHTML = '<p for="groupNumber">Group Code: </p>\n<input type="text" id="groupNumber" name="groupNumber">'
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
    ctx.fillStyle="#F1EADA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();


    ctx.strokeStyle="black";
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

function loadCanvas(campaign){

    var key = campaign+"_"+document.getElementById(campaign).value;

    var parameters = {
        'key': key
    };

    sendJsonRequest(parameters, '/retrievegrid', function(result, targetUrl, params) {

        length = result.length;
        height = result.height;
        map = JSON.parse(result.map);

        board=new Array(height);

        var canvas=document.getElementById("map");
        canvas.width=blocksize*length;
        canvas.height=blocksize*height;

        var ctx=canvas.getContext("2d");
        for(var i=0; i<=canvas.width; i=i+blocksize){
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        for(var i=0; i<=canvas.height; i=i+blocksize){
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = map;
    });
}

function filesystem(maps) {

    var sortedMaps = maps.sort((a, b) => (a.campaign < b.campaign) ? 1 : -1)

    var myHTML = "";
    var curCampaign = JSON.parse(sortedMaps[0]).campaign;
    var pasteCampaign = '"'+curCampaign+'"';
    myHTML = myHTML + "<label for="+pasteCampaign+">"+pasteCampaign+"</label>\n";
    myHTML = myHTML + "<select id="+pasteCampaign+" onChange='loadCanvas("+pasteCampaign+")'>\n";
    myHTML = myHTML + "<option value=''></option>\n";

    for (var i=0; i<sortedMaps.length; i++) {
        console.log(i);
        m = JSON.parse(sortedMaps[i]);
        if (m.campaign == curCampaign){
            myHTML = myHTML + "<option value="+m.map_name+">"+m.map_name+"</option>\n";
        }
        else {
            myHTML = myHTML + "</select>\n";
            curCampaign = m.campaign;
            var pasteCampaign = '"'+curCampaign+'"';
            myHTML = myHTML + "<label for="+pasteCampaign+">"+pasteCampaign+"</label>\n";
            myHTML = myHTML + "<select id="+pasteCampaign+" onChange='loadCanvas("+pasteCampaign+")'>\n";
            myHTML = myHTML + "<option value=''></option>\n";
            myHTML = myHTML + "<option value="+m.map_name+">"+m.map_name+"</option>\n";
        }
    }
    myHTML = myHTML + "</select>\n";
    console.log(myHTML);

    document.getElementById("map_names").innerHTML = myHTML;

}