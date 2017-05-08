
$(document).ready(function(){
    $.get("demo_test.asp", function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
    
    $.get("/subCount", function(data, status){
        //data will contain the count
    });
});