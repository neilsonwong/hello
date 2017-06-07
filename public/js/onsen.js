
$(function() {
    function onsen_init() {
        console.log("inside onsen init");

        // init audio context so our page is ready
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx = new AudioContext(); 
        let audioCtx2 = new AudioContext(); 
        let audioMaster = null;
        let timeline = new Timeline();
        let bg = new BarGraph(document.querySelector(".songBars"));
        let bg2 = new BarGraph(document.querySelector(".artistBars"), {sortRight: true});

        audioMaster = new Audio(audioCtx);
        secondaryAudio = new Audio(audioCtx2);
        visualizer = new Visualizer(audioCtx);

        audioMaster.inject(visualizer.get());
        Timeline.addResizeFunctions(visualizer, bg, bg2);
        timeline.addBarGraph(bg, "title");
        timeline.addBarGraph(bg2, "artist");

        timeline.init(audioMaster);
        visualizer.run();

        //bind functions to btn elements
        $("#btn-tl-start").on("click", timeline.start.bind(timeline));
        $("#btn-tl-playpause").on("click", timeline.manualPlayPause.bind(timeline));
        $("#btn-tl-prev").on("click", timeline.prev.bind(timeline));
        $("#btn-tl-next").on("click", timeline.next.bind(timeline));
    }

    $("body").on("init-onsen", onsen_init);
});