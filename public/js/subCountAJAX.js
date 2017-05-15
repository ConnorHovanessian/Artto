
$(document).ready(function(){
    updateCount();
    window.setInterval(updateCount, 2000);
});

function updateCount(){
    $.get("/subCount", function(data, status){
        var result = JSON.parse(data);
        $("#subs").text(result.subCount);
    });
}