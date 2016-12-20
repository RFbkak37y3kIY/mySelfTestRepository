var EMPTY_COLOR = "rgba(0, 0, 0, 0)";
var oSettings = {
    lastSelector: "#01",
    emptyColor: "rgba(0, 0, 0, 0.8)",
    screenWidth:0,
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
    setupScreen();
    setTimeout(function(){
        $('.preloader').fadeOut(600);
    }, 1000);
    	
    $('.btn#start').click(function(e){
    	$('body').bind('touchstart', TouchStart);
		
		$('body').bind('touchend', TouchEnd);	
	   	
    	console.log("start")
	   	$('.windowLayer').fadeOut();
	   	//$('.layer').css('filter', 'blur(0)');
	   	
	});
	$('.btn#startAgein').click(function(e){
	   $('.windowLayer').fadeOut();
	  // $('.layer').css('filter', 'blur(0)');
	   $('body').bind('touchstart', TouchStart);
		$('body').bind('touchmove', TouchMove);
		$('body').bind('touchend', TouchEnd);	
	   	
	});
	oSettings.screenWidth = $('.layer').width()-$('#fly').width();
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
    var black = id == "#fly"? EMPTY_COLOR: "#000";
    var color = [
        black,black,black,black,black,
        black,black,black,black,black,
        black,black,black,black,black,
        "#FF0","#0FF","#F00","#0F0","#00F","#FFF", "#F0F"];
    $( id+".symble" ).html('');
    
    for(var i=1; i<=3; i++)
    for(var j=1; j<=3; j++){
        $( id+".symble" ).append( '<div id="x'+i+'y'+j+'" style="background-color: '
        +color[Math.floor(Math.random()*color.length)]+'"></div>' );
    }
    if(id != "#fly"){
    	 $('.symble div:not([style="background-color: #000"])').addClass('b');
    }  
    $( "#fly .b").removeClass('b');
    var b = 1;
	for(var i=0; i<9; i++) {
        b &= "rgb(0, 0, 0)" == $($( id + '.symble div')[i]).css("background-color");
    }
    if(b){
    	return reDrowElement(id);
    }

    return arguments.callee;
}
function TouchStart (event) {
    var e = event.originalEvent,
        fly = $('#fly'),
        screenObj = e.touches[0],
        fp = getFlyPos(),
        xx = Math.max(0,Math.min(screenObj.pageX - fp.w/2, oSettings.screenWidth)),
        yy = screenObj.pageY - fp.h*1.5;
    
    
    
    var targetID = $(screenObj.target).parent().attr('id') || 
                    $(screenObj.target).attr('id');
    
    if(!!targetID && ["01","02","03"].indexOf(targetID) != -1){
        copycolorsInFly("#"+targetID);
        fly.css('display',"block");
        fly.css('top',yy +"px");
        fly.css('left',xx +"px");
        oSettings.lastSelector = '#' + targetID;

        $('body').bind('touchmove', TouchMove);
        oSettings.hitTestInterval = setInterval(HitTest, 200);
    }
    
    // console.log(targetID,screenObj);
    e.preventDefault();
}
function TouchMove (event) {
    var screenObj = event.originalEvent.touches[0],
        fp = getFlyPos(),
    	xx = Math.max(0,Math.min(screenObj.pageX - fp.w/2, oSettings.screenWidth)),
        yy = screenObj.pageY - fp.h*1.5;
    
    $('#fly').css('top',yy +"px");
    $('#fly').css('left',xx +"px");

    // HitTest();

    event.originalEvent.preventDefault();
}
function copycolorsInFly(fromID){
    var color, isColor;
    for(var i=0;i<=9;i++){
        color = $($(fromID+" div")[i]).css("background-color")
        isColor = color == "rgb(0, 0, 0)"? EMPTY_COLOR: color;
        $($("#fly div")[i]).css("background-color", isColor)
    }
}

function HitTest() {
    var posDesk, 
        posFly = $($('#fly div')[0]).position(), 
        posParent = $('#fly').position(), 
        dx, dy, d = 120,
        currentEl;
    $('.container div').css('background-color', '');
    setMap();
    

    for(var i=1; i<=6;i++){
        for(var j=1; j<=6;j++){
            posDesk = $( ".container div#x"+j+"y"+i).position();
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
    $( ".container .b").removeClass('b');
    $( "#fly .b").removeClass('b');
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
            oSettings.map[i-1][j-1] = c == oSettings.emptyColor? 0: c;
        }
    }
}

function setColor(x,y,color){
    var el = $( ".container div#x"+x+"y"+y);
    // console.log(color)
    if(el.length && color != EMPTY_COLOR && color != 0){
        el.css("background-color", color);
        el.addClass('b');
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
    // console.log("touch END")
    saveMap();
    if( oSettings.hash != hash2(oSettings.map.toString())){
        reDrowElement(oSettings.lastSelector)
    }
    isLineDel();
    oSettings.hash = hash2(oSettings.map.toString());
    $('body').unbind('touchmove', TouchMove);
	clearInterval(oSettings.hitTestInterval)
    
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
function lh(x,y) {
    return x+y*100;
};
function isCan(x, y){
    var a,f=[[],[],[]],b=[[],[],[]],k=0,c,out=1;
    x = Math.min(x-1,5);
    y = Math.min(y-1,5);
    for(var i=0;i<3;i++){
        a = oSettings.map[i+x].map(a => (a!=0)+0)
        for(var j=0;j<3;j++){
            c = $($('#fly div')[k++]).css('background-color');
            f[i][j] = (c != EMPTY_COLOR)+0;
            b[j][i] = a[j+y];
        }
    }
    for(var i=0;i<3;i++)for(var j=0;j<3;j++)out&=!(b[j][i]&f[j][i]);
    return out;
}
function hash2 (ss, l){
    l=l||32;ss=ss||"";var a=new Uint8Array(ss.split('').map(a => a.charCodeAt(0))),
    s=a.length||1,i=a.length?a.reduce((p,c)=>p+c):1,s="",A,B,k=0,tan=Math.tan;
    while (s.length < l){A=a[k++%s]||0.5;B=a[k++%s]||1.5;i=i+(A^B)%l;s+=tan(i*B/A).toString(16).split('.')[1];}
    return s.slice(0, l);
}
function ani(el){
    el.addClass('aniDel')
    setTimeout(()=>{
        el.removeClass('b');
        el.css('background-color', '');
        el.removeClass('aniDel');
    },500);
}
function aniDelRow(n){
    for(var i=1;i<=8;i++){
        ani($('#x'+i+'y'+n));
        oSettings.map[i-1][n-1] = 0;
    }
}
function aniDelCol(n){
    for(var i=1;i<=8;i++){
        ani($('#x'+n+'y'+i));
        oSettings.map[n-1][i-1] = 0;
    }
}
function rowIsReady(n){
    var out=true;
    for(var i=0;i<8;i++){
        out &= oSettings.map[i][n] != 0;
    }
    return out;
}
function colIsReady(n){
    return oSettings.map[n].indexOf(0) == -1;
}
function isLineDel(){
	var arrLineX = [],
		arrLineY = [];
	for(var i=1;i<=8;i++){
		arrLineX.push(rowIsReady(i-1));
		arrLineY.push(colIsReady(i-1));
	}
	for(var j=1;j<=8;j++){
		if(arrLineX[j-1])	aniDelRow(j);
		if(arrLineY[j-1])	aniDelCol(j);
	}
}
main();