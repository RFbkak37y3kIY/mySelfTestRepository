main();
function main() {
    setupScreen()
    $(".container > div").click(function(e) {
        $(this).css("background-color", "red");
    });

    $('body').bind('touchstart', TouchStart);
    $('body').bind('touchmove', TouchMove);
    $('body').bind('touchend', TouchEnd);
}
function setupScreen(){
    for(var i=1; i<=8;i++){
        for(var j=1; j<=8;j++){
            $( ".container" ).append( '<div id="x'+i+'y'+j+'"></div>' );
        }
    }
    for(var i=1; i<=3;i++){
        for(var j=1; j<=3;j++){
            $( ".symble" ).append( '<div id="x'+i+'y'+j+'"></div>' );
        }
    }    
}
function TouchStart (event) {
    var e = event.originalEvent,
        fly = $('#fly'),
        screenObj = e.touches[0],
        xx = screenObj.pageX,
        yy = screenObj.pageY;
    
    status({
        sX: screenObj.screenX.toFixed(2),
        sY: screenObj.screenY.toFixed(2),
        pX: screenObj.pageX.toFixed(2),
        pY: screenObj.pageY.toFixed(2),
        cX: screenObj.clientX.toFixed(2),
        cY: screenObj.clientY.toFixed(2)
    });
    fly.css('top',yy +"px");
    fly.css('left',xx +"px");
    fly.css('display',"block");
    var targetID = $(screenObj.target).parent().attr('id') || 
                    $(screenObj.target).attr('id');
    console.log(targetID,screenObj);
    e.preventDefault();
}

function TouchMove (event) {
    var e = event.originalEvent,
        screenObj = e.touches[0],
        fp = getFlyPos(),
        xx = e.touches[0].pageX - fp.w / 2,
        yy = e.touches[0].pageY - fp.h / 2;


    status({
        sX: screenObj.screenX.toFixed(2),
        sY: screenObj.screenY.toFixed(2),
        pX: screenObj.pageX.toFixed(2),
        pY: screenObj.pageY.toFixed(2),
        cX: screenObj.clientX.toFixed(2),
        cY: screenObj.clientY.toFixed(2)
    });
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
function status(obj){
    var s = "screen (x:"+obj.sX+", y:"+obj.sY+")<br>page (x:"+obj.pX+", y:"+obj.pY+")<br>client (x:"+obj.cX+", y:"+obj.cY+")<br>";
    $('.status').html(s);
}