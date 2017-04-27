$(function () {
    $("#kotori").click(function openCurtain() {
        $(".viewport").toggleClass("musicStart");
        $(".muse").toggleClass("backstage");
    });

    var link = document.querySelector('link[rel="import"]');
    var content = link.import;
    var nav = content.querySelector('.nav');

    $(".viewport").prepend(nav);
    // document.body.insertBefore(nav, document.body.firstChild);
});