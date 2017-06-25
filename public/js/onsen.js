
$(function() {
    function onsen_init() {
        console.log("inside onsen init");
        let offset = null;
        if (parseInt(window.location.hash.substring(1))){
            offset = parseInt(window.location.hash.substring(1));
        }

        // init audio context so our page is ready
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx = new AudioContext(); 
        let audioMaster = null;
        let timeline = new Timeline();
        let bg = new BarGraph(document.querySelector(".songBars"));
        let bg2 = new BarGraph(document.querySelector(".artistBars"), {sortRight: true});

        audioMaster = new Audio(audioCtx);
        visualizer = new Visualizer(audioCtx);

        audioMaster.inject(visualizer.get());
        timeline.attachObject(visualizer, bg, bg2);
        timeline.addBarGraph(bg, "title");
        timeline.addBarGraph(bg2, "artist");
        // timeline.toggleFullSongMode(audioMaster);

        timeline.init(audioMaster, offset);
        visualizer.run();

        //bind functions to btn elements
        $("#btn-tl-playpause").on("click", timeline.manualPlayPause.bind(timeline));
        $("#btn-tl-prev").on("click", timeline.manualPrev.bind(timeline));
        $("#btn-tl-next").on("click", timeline.manualNext.bind(timeline));

        $(".door").on("click", openGates);

        $(".onsenLogo").on("mouseover", peek);
        $(".onsenLogo").on("mouseout", stopPeeking);

        function openGates(){
            if (timeline.ready){
                console.log("open gates");
                $(".door").addClass("opened");
                stopPeeking();
                setTimeout(timeline.start.bind(timeline), 1000);
            }
            else {
                console.log("timeline still loading!");
            }
        }

        function peek(){
            $(".door").addClass("peek");
            $(".onsenLogo").addClass("peek");
        }
        function stopPeeking(){
            $(".door").removeClass("peek");
        }

        $("body").on("exit-onsen", timeline.exit.bind(timeline));
    }

    $("body").on("init-onsen", onsen_init);
});