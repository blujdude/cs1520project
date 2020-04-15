
const blockSize=26; //Should be even
const drawColor = "black";
const blankColor = "#f1eada";
const enemyColor="#ff0000";

var board;

var fillColor=drawColor;

var drawing=false;

var pcColor;

var playerLocations={};

var enemyMode=false;

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
    ctx.fillStyle=blankColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();


    ctx.strokeStyle=drawColor;
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
    var canvas=document.getElementById("map");
    
    x=x-canvas.getBoundingClientRect().left;
    y=y-canvas.getBoundingClientRect().top;

    if(drawing){
        draw(x, y);
    }

}

function draw(x, y, color=fillColor){ //x and y are already normalized wrt the canvas
    var canvas=document.getElementById("map");
    

    var xIndex=Math.floor(x/blockSize); //
    var yIndex=Math.floor(y/blockSize);
    var ctx=canvas.getContext("2d");

    ctx.fillStyle=color;

    ctx.fillStyle=color;
    ctx.lineWidth=1.5;
    ctx.fillRect(xIndex*blockSize, yIndex*blockSize, blockSize, blockSize);
    ctx.strokeRect(xIndex*blockSize, yIndex*blockSize, blockSize, blockSize);
    ctx.stroke();

}

function drawTool(){
    fillColor=drawColor;
}

function eraseTool(){
    fillColor=blankColor;
}

function saveCanvas(){
    var canvas = document.getElementById("map");
    var canvasContents = canvas.toDataURL();
    
    var canvasData = document.getElementById("canvas_data");
    canvasData.setAttribute("value", canvasContents);

}

function setPC(color){
    pcColor=color;
    enemyMode=false;
}

function placeCharacter(event){
    if(enemyMode) placeEnemy(event);
    else placePC(event);
}

function placeEnemy(event){
    var canvas=document.getElementById("map");
    var ctx=canvas.getContext("2d");
    var x=event.clientX;
    var y=event.clientY;
    x=x-canvas.getBoundingClientRect().left;
    y=y-canvas.getBoundingClientRect().top;
    
    var xIndex=Math.floor(x/blockSize);  //Grid index of the block we are in.
    var yIndex=Math.floor(y/blockSize);

    x = xIndex*blockSize + Math.floor(blockSize/2); //Actual coord of the center of our block
    y = yIndex*blockSize + Math.floor(blockSize/2);

    var pixelData=ctx.getImageData(x, y, 1, 1).data; //Get the data for the pixel of the center of the block

    //Turn RGB to hex.  Really complicated.
    var hexValue="#"+("000000"+((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16)).slice(-6);

    if(hexValue.localeCompare(blankColor)==0){ //Good to draw, empty square.
        ctx.beginPath();  //First, draw.
        ctx.arc(x, y, blockSize/2-1, 0, 2 * Math.PI);

        ctx.fillStyle = enemyColor;
        ctx.lineWidth=1.5;
        ctx.fill();
        ctx.stroke();

    }
    else if(hexValue.localeCompare(enemyColor)==0){ //Remove the enemy
        ctx=canvas.getContext("2d");
        ctx.fillStyle=blankColor;
        ctx.lineWidth=1.5;
        ctx.fillRect(xIndex*blockSize, yIndex*blockSize, blockSize, blockSize);
        ctx.strokeRect(xIndex*blockSize, yIndex*blockSize, blockSize, blockSize);

    }




}

function setEnemyMode(){
    enemyMode=!enemyMode;
    if(enemyMode){ //Set the button color to something that shows it is activated
        return;
    }
    else { //Set it to something that shows it is unactivated
        return;
    }
}

function placePC(event){
    //First check the color of the square
    //Then change the color
    //Then revert the former's square's color back to normal
    //Then update player data structure.

    if(pcColor==null) return;
    var canvas=document.getElementById("map");
    var ctx=canvas.getContext("2d");
    var x=event.clientX;
    var y=event.clientY;
    x=x-canvas.getBoundingClientRect().left;
    y=y-canvas.getBoundingClientRect().top;
    
    var xIndex=Math.floor(x/blockSize);  //Grid index of the block we are in.
    var yIndex=Math.floor(y/blockSize);

    x = xIndex*blockSize + Math.floor(blockSize/2); //Actual coord of the center of our block
    y = yIndex*blockSize + Math.floor(blockSize/2);




    var pixelData=ctx.getImageData(x, y, 1, 1).data; //Get the data for the pixel of the center of the block

    //Turn RGB to hex.  Really complicated.
    var hexValue="#"+("000000"+((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16)).slice(-6);

    if(hexValue.localeCompare(blankColor)==0){ //Good to draw.
        ctx.beginPath();  //First, draw.
        ctx.arc(x, y, blockSize/2-1, 0, 2 * Math.PI);

        ctx.fillStyle = pcColor;
        ctx.lineWidth=1.5;
        ctx.fill();
        ctx.stroke();

        if(playerLocations.hasOwnProperty(pcColor)){ //Character is currently on the map.
            draw(playerLocations[pcColor][0], playerLocations[pcColor][1], blankColor);  //Make old spot blank
        }
        playerLocations[pcColor]=[x,y];
    }
}