var lc = LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {imageURLPrefix: '/literallycanvas/img'}
);

window.onload = function () {
    var oneMinute = 60,
    display = document.querySelector('#time');
    display.textContent = oneMinute; 
    startTimer(oneMinute, display);
    setInterval(submitArt, 5000);
};


function submitArt()
{
    
    var form = document.querySelector('#imageForm');
    var imgText = document.querySelector('#img');
    console.log(lc.getImage().toDataURL());
    imgText.value = lc.getImage().toDataURL();
    form.submit();
}

function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        seconds = (diff % 60) | 0;

        seconds = seconds < 10 ? "6" + seconds : seconds;
        
        if(seconds === 1)
        {
             submitArt();
        }
        
        display.textContent = seconds; 

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}
