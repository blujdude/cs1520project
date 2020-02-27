/*
function clickGridBlock(item){
    if(item.style.backgroundColor=="black") item.style.backgroundColor="white"
    else item.style.backgroundColor="black"
}
*/


//Issues - onload event is not working.  Only one parameter is being expressed for some reason.
function buildCanvas(height, length){

    const blockSize=25;

    var canvas=document.getElementById("map");
    
    canvas.width=blockSize*length;
    canvas.height=blockSize*height;

    var ctx=canvas.getContext("2d");
    for(var i=0; i<=canvas.height; i=i+blockSize){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    for(var i=0; i<=canvas.width; i=i+blockSize){
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

}
