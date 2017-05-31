$(function() {
    // init audio context so our page is ready
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext(); 

    var audio;

    var urls = [
        encodeURI('/mp3/01 三日月.mp3'),
        encodeURI('/mp3/02.Over the clouds.mp3')
    ];

    function init() {
        audioMaster = new Audio(audioCtx);
        visualizer = new Visualizer(audioCtx);
        audioMaster.inject(visualizer.get());

        audioMaster.load(urls, function() {
            visualizer.run();
            audioMaster.play(urls[1]);
        });
    }

    init();


});