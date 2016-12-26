'use strict';

function log(a){
	$('body').append('<div class="error">' + a + '</div>');
}
function tryC(c){
	try {
		c();
	}catch(e){
		log(e.stack.toString())
	}

}
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


$( document ).ready(function() {
	main();
});

function ShowHideElement(el, bool){
	if(bool == true){
		el.css('display', 'block');
		setTimeout(function(){
			el.css('opacity', 1);
		},100);
	}else{
		el.css('opacity', '0');
		setTimeout(function(){
			el.css('display', 'none');
		},1000);
	}
}

function main() {
    tryC(function(){

        setBestScore(parseInt(window.localStorage.getItem("best-score")) || 0);
        setupScreen();
        var onClickToStart = function(e){
            $('.score').html(0);
            ShowHideElement($('.windowLayer'), false);
            $('body').bind('touchstart', TouchStart);
            $('body').bind('touchend', TouchEnd);
            oSettings.map = [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0]
            ];
            setMap();   
        }
        $('.btn#start').click(onClickToStart);
        $('.btn#startAgein').click(onClickToStart);

        $('.btn#backToMenu').click(function(e){
             ShowHideElement($('.windowLayer .GameOver'), false);
             ShowHideElement($('.windowLayer .Menu'),true);
        });
        oSettings.screenWidth = $('.layer').width()-$('#fly').width()-10;
        //log(navigator.appVersion);
        setTimeout(function(){
            ShowHideElement($('.preloader'), false);
            
        }, 1000);

    });
}
function setupScreen(){
    tryC(function(){

        for(var i=1; i<=8;i++){
            for(var j=1; j<=8;j++){
                $( ".container" ).append( '<div id="x'+j+'y'+i+'"></div>' );
            }
        }
        reDrowElement("#01");
        reDrowElement("#02");
        reDrowElement("#03");
        reDrowElement("#fly");
    });
}
function reDrowElement(id){
	tryC(function(){
		
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
	});

    // return arguments.callee;
}
function TouchStart (event) {
	var e = event.originalEvent,
	fly = $('#fly'),
            screenObj = e.touches[0],
            fp = getFlyPos(),
            //xx = Math.max(0,Math.min(screenObj.pageX - fp.w/2, oSettings.screenWidth))-10,
            xx = screenObj.pageX - fp.w/2-10,
            yy = screenObj.pageY - fp.h*1.5;
        
    tryC(function(){
        
            
        
        
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
    });
    // console.log(targetID,screenObj);
    e.preventDefault();

}
function TouchMove (event) {
    tryC(function(){

        var screenObj = event.originalEvent.touches[0],
            fp = getFlyPos(),
        	//xx = Math.max(0,Math.min(screenObj.pageX - fp.w/2, oSettings.screenWidth))-10,
            xx = screenObj.pageX - fp.w/2-10,
            yy = screenObj.pageY - fp.h*1.5;
            
        $('#fly').css('top',yy +"px");
        $('#fly').css('left',xx +"px");

        // HitTest();
    });
    event.originalEvent.preventDefault();
}
function copycolorsInFly(fromID){
    tryC(function(){

        var color, isColor;
        for(var i=0;i<=9;i++){
            color = $($(fromID+" div")[i]).css("background-color")
            isColor = color == "rgb(0, 0, 0)"? EMPTY_COLOR: color;
            $($("#fly div")[i]).css("background-color", isColor)
        }
    });
}

function HitTest() {
    
    try{
        var posDesk, 
            posFly = $($('#fly div')[0]).position(), 
            posParent = $('#fly').position(), 
            dx, dy, d = 120,
            currentEl;
        
        setMap();
        

        for(var i=1; i<=6;i++){
            for(var j=1; j<=6;j++){
                posDesk = $( ".container div#x"+j+"y"+i).position();
                dx = posDesk.left - (posParent.left + posFly.left);
                dy = posDesk.top - (posParent.top + posFly.top);
                if(dx > 0 && dx < d && dy > 0 && dy < d ){
                    if(isCan(j, i)){
                        setColorFly(j,i,0);
                        setColorFly(j+1,i,1);
                        setColorFly(j+2,i,2);
                        setColorFly(j,i+1,3);
                        setColorFly(j+1,i+1,4);
                        setColorFly(j+2,i+1,5);
                        setColorFly(j,i+2,6);
                        setColorFly(j+1,i+2,7);
                        setColorFly(j+2,i+2,8);
                    }
                    return;
                }
            }
        }
    }catch(e){
        log(e.stack.toString());
    }
}
function setMap(){
    tryC(function(){
        $('.container div').css('background-color', '');
        $( ".container .b").removeClass('b');
        $( "#fly .b").removeClass('b');
        for(var i=1; i<=8;i++){
            for(var j=1; j<=8;j++){
                setColor(i,j,oSettings.map[i-1][j-1])
            }
        }
    });
}
function saveMap(){
    tryC(function(){
        var c;
        for(var i=1; i<=8;i++){
            for(var j=1; j<=8;j++){
                c = $( ".container div#x"+i+"y"+j).css("background-color");
                oSettings.map[i-1][j-1] = c == oSettings.emptyColor? 0: c;
            }
        }
    });
}

function setColor(x,y,color){
    try{
        var el = $( ".container div#x"+x+"y"+y);
        // console.log(color)
        if(el.length && color != EMPTY_COLOR && color != 0){
            el.css("background-color", color);
            el.addClass('b');
            return true;
        }
        return false;
    }catch(e){
        log(e.stack.toString());
    }
}
function setColorFly(x,y,id){
    setColor(x, y, $($('#fly div')[id]).css("background-color"))
}
function TouchEnd (event) {
    var e = event.originalEvent;
    tryC(function () {
        
        $('#fly').css('display',"none");
        saveMap();
        if( oSettings.hash != hash2(oSettings.map.toString())){
            reDrowElement(oSettings.lastSelector)
        }
        isLineDel();
        oSettings.hash = hash2(oSettings.map.toString());
        $('body').unbind('touchmove', TouchMove);
        clearInterval(oSettings.hitTestInterval);
        if(isGameOver()){
            
            $(".windowLayer .Menu").css("display", "none");
            $(".windowLayer .GameOver").css("display", "block");
            ShowHideElement($('.windowLayer'), true);
            $('body').unbind('touchstart', TouchStart);
            $('body').unbind('touchend', TouchEnd);
            
        }
    })
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
        a = oSettings.map[i+x].map(function(a){return (a!=0)+0})
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
    l=l||32;ss=ss||"";var a=new Array(ss.split('').map(function(a){return a.charCodeAt(0)})),
    s=a.length||1,i=a.length?a.reduce(function(p,c){return p+c}):1,s="",A,B,k=0,tan=Math.tan;
    while (s.length < l){A=a[k++%s]||0.5;B=a[k++%s]||1.5;i=i+(A^B)%l;s+=tan(i*B/A).toString(16).split('.')[1];}
    return s.slice(0, l);
}
function ani(el){
    el.addClass('aniDel')
    setTimeout(function() {
        el.removeClass('b');
        el.css('background-color', '');
        el.removeClass('aniDel');
    },500);
}
function aniDelRow(n){
	addScore(100);
    for(var i=1;i<=8;i++){
        ani($('#x'+i+'y'+n));
        oSettings.map[i-1][n-1] = 0;
    }
}
function aniDelCol(n){
	addScore(100);
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
function isGameOver(){
	function f(id) {
		var a = $(id+' div'),b='background-color',c="rgb(0, 0, 0)";
	  	return [[$(a[0]).css(b)!=c,$(a[1]).css(b)!=c,$(a[2]).css(b)!=c],
			    [$(a[3]).css(b)!=c,$(a[4]).css(b)!=c,$(a[5]).css(b)!=c],
			    [$(a[6]).css(b)!=c,$(a[7]).css(b)!=c,$(a[8]).css(b)!=c]];
	}
	function d(xx, yy, ar){
		var out = 0;
		for (var x = 0; x <3; x++) {
			for (var y = 0; y <3; y++) {
				out |= (oSettings.map[xx+x][yy+y] != 0) && ar[y][x];
			}
		}
		
		return !out;
	}
	var arr = [f("#01"),f("#02"),f("#03")];
	
	for (var i = 0; i <3; i++) {
		for (var x = 0; x <6; x++) {
			for (var y = 0; y <6; y++) {
				if(d(x,y,arr[i])){
					return false;
				}
			}
		}
	}
	return true;

}
function addScore(n){
	var scr = parseInt($('.score').html()) + n;
	if(oSettings.BestScore < scr){
		setBestScore(scr);
	}
	$('.score').html(scr);
}
function setBestScore(n){
	oSettings.BestScore = n;
	$('.score-best').html(oSettings.BestScore);
	window.localStorage.setItem("best-score", oSettings.BestScore);
}