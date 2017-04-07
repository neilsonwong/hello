$(function () {
    var audio;

    var urls = [
        encodeURI('/mp3/01 三日月.mp3'), 
        encodeURI('/mp3/02.Over the clouds.mp3')
    ];

    function makeButtons(urlList){
        urlList.forEach(function(url, i){
            var btn = $('<button>', { id: 'sound'+i, html: decodeURI(url).substring(5) });
            btn.click(audio.playPause.bind(audio, url));
            $('.player').append(btn);
        });
    };

    $('#magic').click(function(){
        playPauseAll();
    });

   
    function playPauseAll(){
        urls.forEach(function(url){
            audio.playPause(url);
        });
    }

    function init(){
        audio = new Audio();
        makeButtons(urls);
        audio.load(urls);
    }

    init();
    
});