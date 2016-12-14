jQuery('document').ready(function($) {
    "use strict";
    setInterval(function() {
        $.ajax({
            type: "GET",
            url: "/v1/accelerometer/",
            crossDomain: true,
            success: function(responseData, status, xhr) {
             $("#accel-x").text(responseData.x);
             $("#accel-y").text(responseData.y);
             $("#accel-z").text(responseData.z);
            },
            error: function(request, status, error) {
                console.log(error);
            }
        });
    },60000);
});
