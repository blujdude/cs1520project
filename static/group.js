// Write the AJAX to the make_group_post function in main.py

function makeGroup(){
    var username="DUMMY";
    sendJsonRequest(username, '/make_group_post', function(result, targetUrl, un){
        if(result.error){
            document.getElementById("content").innerHTML = 'Error: '+result.error;
        }
        else{
            document.getElementById("content").innerHTML="The group code is "+result.result;
        }
    });
}

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


function sendJsonRequest(username, targetUrl, callbackFunction) {
    var xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            var myObject = JSON.parse(xmlHttp.responseText);
            callbackFunction(myObject, targetUrl, username);
        }
    }
    console.log(targetUrl);
    console.log(username);
    postParameters(xmlHttp, targetUrl, username);
}

function postParameters(xmlHttp, target, username) {
    if (xmlHttp) {
        xmlHttp.open("POST", target, true); // XMLHttpRequest.open(method, url, async)
        var contentType = "application/x-www-form-urlencoded";
        xmlHttp.setRequestHeader("Content-type", contentType);
        xmlHttp.send(username);
    }
}