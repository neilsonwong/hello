var timeline = null;

$(function() {
    // init audio context so our page is ready
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext(); 
    var audioMaster = null;

    timeline = new Timeline();

    
    function init() {
        audioMaster = new Audio(audioCtx);
        visualizer = new Visualizer(audioCtx);
        bg = new BarGraph(document.querySelector(".songBars"));
        bg2 = new BarGraph(document.querySelector(".artistBars"));

        audioMaster.inject(visualizer.get());
        timeline.init(audioMaster);
        visualizer.run();
        timeline.addBarGraph(bg, "title");
        timeline.addBarGraph(bg2, "artist");
        Timeline.addResizeFunctions(visualizer, bg, bg2);
    }

    init();


});