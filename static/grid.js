
const blockSize=25;

var board;

var fillColor="black";

var drawing=false;


function buildCanvas(height, length){

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

function beginDraw(){

    drawing=true;

}
function endDraw(){

    drawing=false;

}

function paint(event){
    var x=event.clientX;
    var y=event.clientY;

    if(drawing){
        draw(x, y);
    }

}

function draw(x, y){
    var canvas=document.getElementById("map");
    
    x=x-canvas.getBoundingClientRect().left;
    y=y-canvas.getBoundingClientRect().top;
    var xIndex=Math.floor(x/blockSize);
    var yIndex=Math.floor(y/blockSize);
    var ctx=canvas.getContext("2d");

    ctx.fillStyle=fillColor;

    ctx.fillRect(xIndex*blockSize, yIndex*blockSize, blockSize, blockSize);
    ctx.stroke();

}

function drawTool(){
    fillColor="black";
}

function eraseTool(){
    fillColor="white";
}