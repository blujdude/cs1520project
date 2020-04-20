function selectCampaign(maps) {

    var myHTML = "";
    myHTML = myHTML + "<label for='campaigns'>Campaign: </label>\n";
    var stringMaps = JSON.stringify(maps);
    myHTML = myHTML + "<select id='campaigns' onChange='selectName("+stringMaps+")'>\n";
    myHTML = myHTML + "<option value=''></option>\n";

    var campaigns = []
    for (var i = 0; i < maps.length; i++) {
        parsed = JSON.parse(maps[i])
        if (campaigns.includes(parsed.campaign) == false){
            campaigns.push(parsed.campaign)
            myHTML = myHTML + "<option value="+(parsed.campaign).replace(/ /g,"_")+">"+parsed.campaign+"</option>\n";
        }
    }
    document.getElementById("map_names").innerHTML = myHTML;

}

function selectName(maps) {

    campaign = document.getElementById("campaigns").value;

    var myHTML = "";
    myHTML = myHTML + "<label for='names'>Map Name: </label>\n";
    var stringMaps = JSON.stringify(maps);
    myHTML = myHTML + "<select id='names' onChange='selectFloor("+stringMaps+")'>\n";
    myHTML = myHTML + "<option value=''></option>\n";

    var names = []
    for (var i = 0; i < maps.length; i++) {
        parsed = JSON.parse(maps[i])
        if (names.includes(parsed.map_name) == false && parsed.campaign == campaign){
            names.push(parsed.map_name)
            myHTML = myHTML + "<option value="+(parsed.map_name).replace(/ /g,"_")+">"+parsed.map_name+"</option>\n";
        }
    }
    console.log(myHTML);
    document.getElementById("map_names").innerHTML = document.getElementById("map_names").innerHTML + myHTML;

}

function selectFloor(maps) {

    campaign = document.getElementById("campaigns").value;
    map_name = document.getElementById("names").value;

    var myHTML = "";
    myHTML = myHTML + "<label for='floors'>Floor: </label>\n";
    myHTML = myHTML + "<select id='floors' onChange=makeSubmitButton()>\n";
    myHTML = myHTML + "<option value=''></option>\n";

    var floors = []
    for (var i = 0; i < maps.length; i++) {
        parsed = JSON.parse(maps[i])
        if (floors.includes(parsed.floor) == false && parsed.campaign == campaign && parsed.map_name == map_name){
            floors.push(parsed.floor)
            myHTML = myHTML + "<option value="+(parsed.floor).replace(/ /g,"_")+">"+parsed.floor+"</option>\n";
        }
    }
    document.getElementById("map_names").innerHTML = document.getElementById("map_names").innerHTML + myHTML;

}

function makeSubmitButton(){
    myHTML = "<button type='submit' class='btn btn-primary btn-round' onClick=followLink()>Submit</button>";
    document.getElementById("map_names").innerHTML = document.getElementById("map_names").innerHTML + myHTML;
}

function followLink(){

    campaign = document.getElementById("campaigns").value;
    map_name = document.getElementById("names").value;
    floor = document.getElementById("floors").value;

    link = "/grid/"+campaign+"_"+map_name+"_"+floor;
    window.location.href = link
}