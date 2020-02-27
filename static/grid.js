
var board;

var fillColor="black";

function buildCanvas(height, length){

    board=[];

    //Rows
    for(var i=0; i<height; i++){
        var temp=[];
        //Cols
        for(var z=0; z<length; z++){
            temp[z]=0;
        }

        board[i]=temp;

    }

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

function beginDraw(){



}
function endDraw(){

}
function draw(){

}