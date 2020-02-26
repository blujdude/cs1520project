/*
function clickGridBlock(item){
    if(item.style.backgroundColor=="black") item.style.backgroundColor="white"
    else item.style.backgroundColor="black"
}
*/


//Issues - onload event is not working.  Only one parameter is being expressed for some reason.
function buildCanvas(height, length){

    var canvas=document.getElementById("map");
    
    // 70px blocks for now
    canvas.width=40*length;
    canvas.height=40*height;

    var ctx=canvas.getContext("2d");

    ctx.fillStyle = "#42F5C2";
    ctx.fillRect(0, 0, canvas.width, canvas.length)
}
