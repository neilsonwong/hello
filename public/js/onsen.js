
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
        visualizer = new Visualizer2(audioCtx);

        audioMaster.inject(visualizer.get());
        timeline.attachObject(visualizer, bg, bg2);
        timeline.addBarGraph(bg, "title");
        timeline.addBarGraph(bg2, "artist");
        // timeline.setFullSongMode(true);

        timeline.init(audioMaster, offset);
        visualizer.run();

        //bind functions to btn elements
        $("#btn-tl-playpause").on("click", timeline.manualPlayPause.bind(timeline));
        $("#btn-tl-prev").on("click", timeline.manualPrev.bind(timeline));
        $("#btn-tl-next").on("click", timeline.manualNext.bind(timeline));
        // $("#btn-tl-repeat").on("click", timeline.toggleFullSong.bind(timeline));

        $("#btn-jump-random").on("click", timeline.jumpRandom.bind(timeline));
        $("#btn-loved-onsen").on("click", timeline.setPlayMode.bind(timeline, "loved", 0, timeline.start.bind(timeline)));
        $("#btn-top-onsen").on("click", timeline.setPlayMode.bind(timeline, "top", 0, timeline.start.bind(timeline)));
        $("#btn-time-onsen").on("click", timeline.setPlayMode.bind(timeline, "chronological", 0, timeline.start.bind(timeline)));
        $("#btn-about-onsen").on("click", timeline.jumpRandom.bind(timeline));

        $(".door").on("click", openGates);

        $(".onsenLogo").on("mouseover", peek);
        $("#bg-blur").on("mouseover", peek);
        $("#bg-blur").addClass("hoverable");
        $(".onsenLogo").on("mouseout", stopPeeking);

        function openGates(){
            if (timeline.ready){
                console.log("open gates");

                //turn off mouse overs
                $(".onsenLogo").off("mouseover");
                $("#bg-blur").off("mouseover");
                $(".onsenLogo").off("mouseout");
                $(".door").off("click");

                $(".door").addClass("opened");
                $("#bg-cover").css("opacity", "1");
                $("#bg-blur").css("z-index", "-9999");
                $("#bg-blur").removeClass("hoverable");
                $(".onsen-info").css("display", "none");

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
        function stopPeeking(e){
            $(".door").removeClass("peek");
            
        }

        $("body").on("exit-onsen", timeline.exit.bind(timeline));
    }

    $("body").on("init-onsen", onsen_init);
});