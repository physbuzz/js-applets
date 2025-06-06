let myNoise, myNoiseWidth, myNoiseHeight;

let scw=window.innerWidth;
let sch=window.innerHeight;
let draww=600;
let drawh=600;
let centerx=scw/2;
let centery=sch/2;
let mouseIsPressed=false;
let mouseStatus=0;

/** Create a letiable to easily handle the status of the mouse
0=not pressed
1=just pressed
2=mouse held
3=mouse just released
*/
function mousePressed(){ mouseIsPressed=true; };
function mouseReleased(){ mouseIsPressed=false; };
function updateMouseStatus(){
    if(mouseStatus===0){
        if(mouseIsPressed){
            mouseStatus=1;
        }
    } else if(mouseStatus===1){
        mouseStatus=2;
    } else if(mouseStatus===2){
        if(!mouseIsPressed){
            mouseStatus=3;
        }
    } else if(mouseStatus===3){
        mouseStatus=0;
    }
};

function createNoiseImage(w,h) {
    let img=createImage(w,h);
    img.loadPixels();
    let sc=3;
    for(let y=0;y<h;y++){
        for(let x=0;x<w;x++){
            let s=random()*sc;
            let r=255-s*2;
            let g=255-s*2;
            let b=255-s;
            let i=4*(y*w+x);
            img.pixels[i]=r;
            img.pixels[i+1]=g;
            img.pixels[i+2]=b;
            img.pixels[i+3]=255;
        }
    }
    img.updatePixels();
    return img;
}

/** Draggable Bar
 * An object representing a horizontal draggable bar.
 *
 * Style used from peter collingridge because it's smoooooth. http://www.khanacademy.org/cs/simulation-of-an-ionic-solid/1122503811
 *
 * Usage
 * ex:
***
let tmp=new DraggableBar(53,38,100,20,11,50,0,color(179, 29, 179));
let draw= function() {
    background(255, 255, 255);
    fill(0, 0, 0);
    text(tmp.getVal(),0,20);
    updateMouseStatus();
    tmp.draw();
    tmp.handleMouseInput();
};
***
 * Arguments
 * x,y: positioned at (x,y)
 * width ,height: dimensions width,height
 * minval: when the bar is dragged to the left, getVal()
 *      will read minval
 * maxval: to the right, getVal() will red maxval
 * initialval: The value getVal is to return before the bar
 *      has been moved.
 * col: The color of the filled portion of the bar.
 *      Should be passed as ex. color(255, 0, 0);
 *
 * Functions
 * draw(): draws the bar on the screen.
 * getVal(): returns the current value, between minval and
 *      maxval
 * handleMouseInput(): handles updating the bar's value.
 *      Should be called each frame.
*/
let DraggableBar=function(x,y,width,height,minval,maxval,initialval,col){
    let curcoord=(initialval-minval)/(maxval-minval)*width;
    let clickheld=0;
    let wasmoved=0;
    this.getClickHeld=function(){
        return clickheld;
    };
    this.setVal=function(n){
        curcoord=(n-minval)*width/(maxval-minval);
    };
    this.draw=function() {
        noStroke();
        fill(col);
        //rect(x,y,curcoord,height);
        strokeWeight(1);
        stroke(0,0,0);
        noStroke();
        fill(194, 194, 194);
        rect(x,y+height/2-2,width,4,3);
        fill(132, 140, 148);
        stroke(0, 0, 0);
        ellipse(x+curcoord,y+height/2,10,10);
    };
    this.getVal=function(){
        return curcoord/width*(maxval-minval)+minval;
    };
    this.handleMouseInput=function(){
        wasmoved=0;
        if(mouseX>=x && mouseY>=y && mouseX<=x+width && mouseY<=y+height){
            if(clickheld===0){
                if(mouseStatus===1){
                    clickheld=1;
                }
            }
        }
        if(clickheld===1){
            if(mouseX<x){
                curcoord=0;
            }
            if(mouseX>x+width){
                curcoord=width;
            }
            if(mouseStatus===3 || mouseStatus===0){
                clickheld=0;
            } else if(mouseX>=x && mouseX<=x+width) {
                let curcoordnew=mouseX-x;
                if(curcoord!=curcoordnew){
                    wasmoved=1;
                    curcoord=curcoordnew;
                }
            }
        }
    };
    this.wasMoved=function(){
        return (wasmoved==1);
    };
    this.rescale=function(neww,newh){
        let v=this.getVal();
        width=neww;
        height=newh;
        curcoord=(v-minval)/(maxval-minval)*width;
    };
    this.reposition=function(x2,y2){
        x=x2;
        y=y2;
    };
};



let TextDraggableBar=function(txt,x,y,width,height,minval,maxval,initialval,col){
    let n=textWidth(txt);
    let barwidth=width-30-n;
    let bar=new DraggableBar(x+n+20,y,barwidth,height,minval,maxval,initialval,col);
    this.draw= function() {
        drawBox(x,y,width,height,txt);
        bar.draw();
    };
    this.update=function(){
        bar.handleMouseInput();
    };
    this.getVal=function(){
        return bar.getVal();
    };
    this.setVal=function(n){
        bar.setVal(n);
    };
    this.wasMoved=function(){
        return bar.wasMoved();
    }
    this.getClickHeld=function(){
        return bar.getClickHeld();
    };
    this.rescale=function(xs,ys){
        width=xs;
        height=ys;
        barwidth=width-30-n;
        bar.rescale(barwidth,ys);
    };
    this.reposition=function(xs,ys){
        x=xs;
        y=ys;
        bar.reposition(x+n+20,ys);
    };
};

//let myFont = createFont("Impact", 15);
let drawBox = function(x, y, w, h, heading) {
    noStroke();
    fill(50, 50, 50, 50);
    rect(x+2, y+2, w, h, 8);
    fill(255, 255, 255, 230);
    rect(x, y, w, h, 8);
    if(heading!==undefined){
        //textFont(myFont, 15);
        fill(10, 10, 10);
        text(heading, x+10, y+16);
    }
};

let a=1.4;
let b=-2.3;
let c=2.4;
let d=-2.1;

let mapF=function(v){
    return {x:Math.sin(a*v.y)-Math.cos(b*v.x),
        y:Math.sin(c*v.x)-Math.cos(d*v.y)
    };
};

let barA, barB, barC, barD, vec, pointsdrawn;


function drawNoiseBackground(){
    for(let a=0;a<Math.ceil(width/myNoiseWidth);a++){
        for(let b=0;b<Math.ceil(height/myNoiseHeight);b++) {
            image(myNoiseImage, a*myNoiseWidth,b*myNoiseHeight);
        }
    }
}
function setup() {
    createCanvas(400, 400)

    barA=new TextDraggableBar("A:",100,sch-140,scw-200,24,-4,4,1.4,color(0,0,0));
    barB=new TextDraggableBar("B:",100,sch-110,scw-200,24,-4,4,-2.3,color(0,0,0));
    barC=new TextDraggableBar("C:",100,sch-80,scw-200,24,-4,4,2.4,color(0,0,0));
    barD=new TextDraggableBar("D:",100,sch-50,scw-200,24,-4,4,-2.1,color(0,0,0));
    vec={x:1,y:1};
    pointsdrawn=0;
    myNoiseWidth=200;
    myNoiseHeight=200;
    myNoiseImage=createNoiseImage(myNoiseWidth,myNoiseHeight);
    drawNoiseBackground();
}


function windowResized() {
    if(width!=window.innerWidth || height!=window.innerHeight) {
        scw=window.innerWidth;
        sch=window.innerHeight;
        centerx=window.innerWidth/2;
        centery=window.innerHeight/2;
        resizeCanvas(window.innerWidth,window.innerHeight);
        smooth();
        barA.reposition(100,sch-140);
        barB.reposition(100,sch-110);
        barC.reposition(100,sch-80);
        barD.reposition(100,sch-50);
        barA.rescale(scw-200,24);
        barB.rescale(scw-200,24);
        barC.rescale(scw-200,24);
        barD.rescale(scw-200,24);
        drawNoiseBackground();
//        console.log(vec.x+", "+vec.y);
//        console.log(centerx+", "+centery);
//        console.log(scw+", "+sch);
//        console.log(a+", "+b+", "+c+", "+d);
        pointsdrawn=0;
    }
}

function draw() {

    updateMouseStatus();


    barA.update();
    barB.update();
    barC.update();
    barD.update();

    a=barA.getVal();
    b=barB.getVal();
    c=barC.getVal();
    d=barD.getVal();
    noStroke();
    if(barA.wasMoved() ||barB.wasMoved() ||barC.wasMoved() ||barD.wasMoved()){
        fill(251, 250, 255);
        rect(centerx-300,centery-300,600,600);
        pointsdrawn=0;
    }
    if(pointsdrawn<1000000){
            strokeWeight(1);
            stroke(0,0,0,10);
        for(let n=0;n<10000;n++){
            vec=mapF(vec);
            point(centerx+vec.x*100,centery-vec.y*100);
        }
        pointsdrawn+=10000;
    }
    fill(251, 250, 255);
    rect(0,0,scw,70);
    rect(0,sch-150,scw,150);



    //textFont(myFont, 19);
    drawBox(353,10,164,45);
    fill(0, 0, 0);
    text("A: "+(""+a).substr(0,5), 360,30);
    text("B: "+(""+b).substr(0,5), 360,50);
    text("C: "+(""+c).substr(0,5), 460,30);
    text("D: "+(""+d).substr(0,5), 460,50);

    barA.draw();
    barB.draw();
    barC.draw();
    barD.draw();
};

