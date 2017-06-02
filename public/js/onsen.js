var timeline = null;
bg = null;

$(function() {
    // init audio context so our page is ready
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext(); 
    var audioMaster = null;

    timeline = new Timeline();

    function init() {
        audioMaster = new Audio(audioCtx);
        visualizer = new Visualizer(audioCtx);
        audioMaster.inject(visualizer.get());
        timeline.init(audioMaster);
        visualizer.run();
    }

    init();

    bg = new BarGraph(document.querySelector(".songBars"));

});