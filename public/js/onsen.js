$(function() {
    // init audio context so our page is ready
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext(); 

    var audio;

    var urls = [
        encodeURI('/mp3/01 三日月.mp3'),
        encodeURI('/mp3/02.Over the clouds.mp3')
    ];

    function makeButtons(urlList) {
        urlList.forEach(function(url, i) {
            var btn = $('<button>', {
                id: 'sound' + i,
                html: decodeURI(url).substring(5)
            });
            btn.click(audio.playPause.bind(audio, url));
            $('.player').append(btn);
        });
    };

    $('#magic').click(function() {
        playPauseAll();
    });


    function playPauseAll() {
        urls.forEach(function(url) {
            audio.playPause(url);
        });
    }

    function init() {
        audioMaster = new Audio(audioCtx);
        visualizer = new Visualizer(audioCtx);
        audioMaster.inject(visualizer.get());

        makeButtons(urls);
        audioMaster.load(urls, function() {
            console.log("done loading");
            visualizer.visualize();
        });
    }

    init();


});