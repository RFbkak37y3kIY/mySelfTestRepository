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
        xx = screenObj.pageX-150,
        yy = screenObj.pageY-300;
    
    fly.css('top',yy +"px");
    fly.css('left',xx +"px");
    fly.css('display',"block");
    var targetID = $(screenObj.target).parent().attr('id') || 
                    $(screenObj.target).attr('id');
    console.log(targetID);
    e.preventDefault();
}

function TouchMove (event) {
    var e = event.originalEvent;
    var xx = e.touches[0].pageX-150,
        yy = e.touches[0].pageY-300;
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

