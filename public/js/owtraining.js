$(function() {
    let MINUTE = 60000;
    let INTER = 2000;
    let PLAYLIST;

    function owtraining_init() {
        console.log("ow training init");
        PLAYLIST = [
            {
                description: "track static bots",
                duration: 1.5
            },
            {
                description: "flick side to side on static bots",
                duration: 0.5
            },
            {
                description: "blink flicking",
                duration: 2
            },
            {
                description: "jump crouch static bots",
                duration: 1
            },
            {
                description: "180 static bots",
                duration: 0.5 
            },
            {
                description: "track heads on moving bots",
                duration: 1
            },
            {
                description: "kill moving bots",
                duration: 1
            },
            {
                description: "jump crouch moving bots",
                duration: 2
            },
            {
                description: "blinking around moving bots",
                duration: 1.5
            },
            {
                description: "blinking flicking on moving bots",
                duration: 1.5
            },
            {
                description: "180 on moving bots",
                duration: 1
            },
        ];

        $("#start_training").on("click", start);
    }

    function start(){
        console.log("start called");
        let chain = Promise.resolve();
        chain = chain.then(sayWithDelay.bind(null, "starting in 10 seconds", 10000));
        for (let i = 0; i < PLAYLIST.length; ++i){
            chain = chain.then(handleItem.bind(null, PLAYLIST[i]));
        }
        chain = chain.then(sayWithDelay.bind(null, "training done", 1));
    }

    function sayWithDelay(thing, delay){
        return new Promise((resolve, reject) => {
            sayStuff(thing);
            setTimeout(() => {
                resolve(true);
            }, delay) 
        });
    }

    function handleItem(item){
        return new Promise((resolve, reject) => {
            sayStuff(item.description);
            let delay = (item.duration *MINUTE) + INTER;
            // console.log(delay);
            setTimeout(() => {
                resolve(true);
            }, delay) 
        });
    }

    function sayStuff(what){
        let msg = new SpeechSynthesisUtterance();
        msg.text = what;
        // msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google 日本語"; })[0];
        window.speechSynthesis.speak(msg);
    }

    $("body").on("init-owtraining", owtraining_init);
});
