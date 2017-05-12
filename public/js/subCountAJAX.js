
$(document).ready(function(){
    update();
    window.setInterval(update, 2000);
});

function update(){
    $.get("/subCount", function(data, status){
        console.log(data);
        var result = JSON.parse(data);
        $("#subs").text(result.subCount);
    });
}