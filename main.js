var oSettings = {
    lastSelector: "#01"
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
            $( ".container" ).append( '<div id="x'+i+'y'+j+'"></div>' );
        }
    }
    reDrowElement("#01");
    reDrowElement("#02");
    reDrowElement("#03");
    reDrowElement("#fly");
}
function reDrowElement(id){
    var black = id == "#fly"? "rgba(0,0,0,0)": "#000";
    var color = [
        black,
        black,
        black,
        black,
        black,
        black,
        black,
        "#FF0",
        "#0FF",
        "#F00",
        "#0F0",
        "#00F",
        "#FFF"
    ];
    for(var i=1; i<=3; i++)
    for(var j=1; j<=3; j++){
        $( id+".symble" ).append( '<div id="x'+i+'y'+j+'" style="background-color: '+color[Math.floor(Math.random()*color.length)]+'"></div>' );
    }
}
function TouchStart (event) {
    var e = event.originalEvent,
        fly = $('#fly'),
        screenObj = e.touches[0],
        fp = getFlyPos(),
        xx = screenObj.pageX - fp.w/2,
        yy = screenObj.pageY - fp.h*1.5;
    
    status(screenObj);
    fly.css('top',yy +"px");
    fly.css('left',xx +"px");
    
    var targetID = $(screenObj.target).parent().attr('id') || 
                    $(screenObj.target).attr('id');
    copycolorsInFly("#"+targetID);
    if(!!targetID && ["01","02","03"].indexOf(targetID) != -1){
        fly.css('display',"block");
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
    e.preventDefault();
}

function TouchEnd (event) {
    var e = event.originalEvent;
    $('#fly').css('display',"none");
    console.log("touch END")
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
main();