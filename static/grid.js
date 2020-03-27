
const blockSize=25;

var board;

var fillColor="white";

var drawing=false;

var pcColor;

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


function beginDraw(event){

    drawing=true;

    paint(event);

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
    fillColor="white";
}

function eraseTool(){
    fillColor="black";
}

function saveCanvas(){
    var canvas = document.getElementById("map");
    var canvasContents = canvas.toDataURL();
    
    var canvasData = document.getElementById("canvas_data");
    canvasData.setAttribute("value", canvasContents);

}

function setPC(color){
    pcColor=color;
}