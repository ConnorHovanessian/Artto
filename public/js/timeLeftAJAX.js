
$(document).ready(function(){
    updateTime();
    window.setInterval(updateTime, 500);
});

function updateTime(){
    $.get("/timeLeft", function(data, status){
        var result = data;
        console.log(result);
        $("#time").text(result);
    });
}