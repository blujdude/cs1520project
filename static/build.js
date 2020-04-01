function filesystem(maps) {

    var sortedMaps = maps.sort((a, b) => (a.campaign < b.campaign) ? 1 : -1)

    var myHTML = "";
    var curCampaign = JSON.parse(sortedMaps[0]).campaign;
    var pasteCampaign = '"'+curCampaign+'"';
    myHTML = myHTML + "<label for="+pasteCampaign+">"+pasteCampaign+"</label>\n";
    myHTML = myHTML + "<select id="+pasteCampaign+" onChange='followLink("+pasteCampaign+")'>\n";
    myHTML = myHTML + "<option value=''></option>\n";

    for (var i=0; i<sortedMaps.length; i++) {
        console.log(i);
        m = JSON.parse(sortedMaps[i]);
        if (m.campaign == curCampaign){
            myHTML = myHTML + "<option value="+(m.map_name).replace(/ /g,"_")+">"+m.map_name+"</option>\n";
        }
        else {
            myHTML = myHTML + "</select>\n";
            curCampaign = m.campaign;
            var pasteCampaign = '"'+curCampaign+'"';
            myHTML = myHTML + "<label for="+pasteCampaign+">"+pasteCampaign+"</label>\n";
            myHTML = myHTML + "<select id="+pasteCampaign+" onChange='followLink("+pasteCampaign+")'>\n";
            myHTML = myHTML + "<option value=''></option>\n";
            myHTML = myHTML + "<option value="+(m.map_name).replace(/ /g,"_")+">"+m.map_name+"</option>\n";
        }
    }
    myHTML = myHTML + "</select>\n";
    console.log(myHTML);

    document.getElementById("map_names").innerHTML = myHTML;

}

function followLink(campaign){
    var partialKey = campaign+"_"+document.getElementById(campaign).value;
    console.log(partialKey)
    link = "/grid/"+partialKey;
    window.location.href = link
}