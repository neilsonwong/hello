
$(function() {
    function init() {
        // init audio context so our page is ready
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioCtx = new AudioContext(); 
        var audioMaster = null;

        var timeline = new Timeline();

        audioMaster = new Audio(audioCtx);
        visualizer = new Visualizer(audioCtx);
        bg = new BarGraph(document.querySelector(".songBars"));
        bg2 = new BarGraph(document.querySelector(".artistBars"), {sortRight: true});

        audioMaster.inject(visualizer.get());
        timeline.init(audioMaster);
        visualizer.run();
        timeline.addBarGraph(bg, "title");
        timeline.addBarGraph(bg2, "artist");
        Timeline.addResizeFunctions(visualizer, bg, bg2);
        
        //bind functions to btn elements
        $("#btn-tl-start").on("click", timeline.start.bind(timeline));
        $("#btn-tl-playpause").on("click", timeline.manualPlayPause.bind(timeline));
        $("#btn-tl-prev").on("click", timeline.prev.bind(timeline));
        $("#btn-tl-next").on("click", timeline.next.bind(timeline));
    }

    $("#onsen").load(init);
});