var page = 2;

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

$(document).ready(function() {
    
    //Options for spinner plugin
    var opts = {
          lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 5 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 0.5 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1.2 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '80%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: true // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'relative' // Element positioning
    }
    
    var target = document.getElementById('submissions');

    $(window).scroll(function () { 
        
       if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
            
            var spinner = new Spinner(opts).spin();
            target.appendChild(spinner.el);

            
            $.get("/hofPage?page=" + page, function(data, status){
                var result = JSON.parse(data);
                if(result.error)
                {
                    console.log(result.error);
                    spinner.stop();
                }
                else
                {
                    result.docs.forEach(submission =>{
                        var elem = document.createElement("img");
                        elem.setAttribute("src", "/hof/" + submission._id + ".png");
                        elem.setAttribute("alt", "submission");
                        elem.setAttribute("class", "img-thumbnail");
                        target.appendChild(elem);
                    });

                    page++;
                    spinner.stop();
                    
                }
                
            });
          
       }
       
    });
});
