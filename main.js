var oSettings = {
    lastSelector: "#01",
    map: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    hash:'eafb5775474fed1ce116ed6114ecb0e8'
}
function main() {
    setupScreen()
    
    $('body').bind('touchstart', TouchStart);
    $('body').bind('touchmove', TouchMove);
    $('body').bind('touchend', TouchEnd);

    setTimeout(function(){
        $('.preloader').fadeOut(600);
    }, 1000);
}
function setupScreen(){
    for(var i=1; i<=8;i++){
        for(var j=1; j<=8;j++){
            $( ".container" ).append( '<div id="x'+j+'y'+i+'"></div>' );
        }
    }
    reDrowElement("#01")("#02")("#03")("#fly");
}
function reDrowElement(id){
    var black = id == "#fly"? "rgba(0,0,0,0)": "#000";
    var color = [black,black,black,black,black,"#FF0","#0FF","#F00","#0F0","#00F","#FFF", "#F0F"];
    $( id+".symble" ).html('');
    for(var i=1; i<=3; i++)
    for(var j=1; j<=3; j++){
        $( id+".symble" ).append( '<div id="x'+i+'y'+j+'" style="background-color: '
        +color[Math.floor(Math.random()*color.length)]+'"></div>' );
    }
    return arguments.callee;
}
function TouchStart (event) {
    var e = event.originalEvent,
        fly = $('#fly'),
        screenObj = e.touches[0],
        fp = getFlyPos(),
        xx = screenObj.pageX - fp.w/2,
        yy = screenObj.pageY - fp.h*1.5;
    
    
    
    var targetID = $(screenObj.target).parent().attr('id') || 
                    $(screenObj.target).attr('id');
    
    if(!!targetID && ["01","02","03"].indexOf(targetID) != -1){
        copycolorsInFly("#"+targetID);
        fly.css('display',"block");
        fly.css('top',yy +"px");
        fly.css('left',xx +"px");
        oSettings.lastSelector = '#' + targetID;
        
    }
    
    console.log(targetID,screenObj);
    e.preventDefault();
}
function copycolorsInFly(fromID){
    var color, isColor;
    for(var i=0;i<=9;i++){
        color = $($(fromID+" div")[i]).css("background-color")
        isColor = color == "rgb(0, 0, 0)"? "rgba(0,0,0,0)": color;
        $($("#fly div")[i]).css("background-color", isColor)
    }
}
function TouchMove (event) {
    var e = event.originalEvent,
        screenObj = e.touches[0],
        fp = getFlyPos(),
        xx = screenObj.pageX - fp.w/2,
        yy = screenObj.pageY - fp.h*1.5;

    status(screenObj);
    $('#fly').css('top',yy +"px");
    $('#fly').css('left',xx +"px");

    $('.container div').css('background-color', '');
    
    // $('.container div#x'+xx+'y'+yy).css('background-color', '');
    
    HitTest();

    e.preventDefault();
}
function HitTest() {
    var posDesk, 
        posFly = $($('#fly div')[0]).position(), 
        posParent = $('#fly').position(), 
        dx, dy, d = 120,
        currentEl;
    // $(".container div").css("background-color", null);
    setMap();
    

    for(var i=1; i<=6;i++){
        for(var j=1; j<=6;j++){
            currentEl = $( ".container div#x"+j+"y"+i);
            posDesk = currentEl.position();
            dx = posDesk.left - (posParent.left + posFly.left);
            dy = posDesk.top - (posParent.top + posFly.top);
            if(dx > 0 && dx < d && dy > 0 && dy < d ){
                if(isCan(j, i)){
                    setColorFly(j,i,0)(j+1,i,1)(j+2,i,2)(j,i+1,3)(j+1,i+1,4)(j+2,i+1,5)(j,i+2,6)(j+1,i+2,7)(j+2,i+2,8);
                }
                return;
            }
        }
    }
}
function setMap(){
    for(var i=1; i<=8;i++){
        for(var j=1; j<=8;j++){
            setColor(i,j,oSettings.map[i-1][j-1])
        }
    }
}
function saveMap(){
    var c;
    for(var i=1; i<=8;i++){
        for(var j=1; j<=8;j++){
            c = $( ".container div#x"+i+"y"+j).css("background-color");
            oSettings.map[i-1][j-1] = c == "rgb(26, 26, 26)"? 0: c;
        }
    }
}

function setColor(x,y,color){
    var el = $( ".container div#x"+x+"y"+y);

    if(el.length && color != "rgba(0, 0, 0, 0)"){
        el.css("background-color", color);
        return true;
    }
    return false;
}
function setColorFly(x,y,id){
    setColor(x, y, $($('#fly div')[id]).css("background-color"))
    return arguments.callee;
}
function TouchEnd (event) {
    var e = event.originalEvent;
    $('#fly').css('display',"none");
    console.log("touch END")
    saveMap();
    if( oSettings.hash != hash2(oSettings.map.toString())){
        oSettings.hash = hash2(oSettings.map.toString());
        reDrowElement(oSettings.lastSelector)
    }
    e.preventDefault();
}
function getFlyPos() {
    return {
        w: parseInt($('#fly').css('width')),
        h: parseInt($('#fly').css('height')),
        x: parseInt($('#fly').css('left')),
        y: parseInt($('#fly').css('top'))
    }
}
function status(screenObj){
    var obj = {
        sX: screenObj.screenX.toFixed(2),
        sY: screenObj.screenY.toFixed(2),
        pX: screenObj.pageX.toFixed(2),
        pY: screenObj.pageY.toFixed(2),
        cX: screenObj.clientX.toFixed(2),
        cY: screenObj.clientY.toFixed(2)
    }
    var s = "screen (x:"+obj.sX+", y:"+obj.sY+")<br>page (x:"+obj.pX+", y:"+obj.pY+")<br>client (x:"+obj.cX+", y:"+obj.cY+")<br>";
    $('.status').html(s);
}
function lh(x,y) {
    return x+y*100;
};
function isCan(x, y){
    var a, 
        f = [[],[],[]],
        k=0,
        c, 
        out = 1;
        x = Math.min(x-1,5);
        y = Math.min(y-1,5);
    
    for(var i=0;i<3;i++){
        a = oSettings.map[i+x].map(a => (a!=0)+0)
        for(var j=0;j<3;j++){
            c = $($('#fly div')[k++]).css('background-color');
            f[i][j] = (c != "rgba(0, 0, 0, 0)")+0;
            out &= !(a[j+y]&f[j][i])
        }
    }
    console.log(f)
    return out;
}
function hash2 (ss, l){
    l=l||32;ss=ss||"";var a=new Uint8Array(ss.split('').map(a => a.charCodeAt(0))),
    s=a.length||1,i=a.length?a.reduce((p,c)=>p+c):1,s="",A,B,k=0,tan=Math.tan;
    while (s.length < l){A=a[k++%s]||0.5;B=a[k++%s]||1.5;i=i+(A^B)%l;s+=tan(i*B/A).toString(16).split('.')[1];}
    return s.slice(0, l);
}
main();