jQuery('document').ready(function($) {
    "use strict";
    $(".ledsubmit").click(function() {
        var id = $(this).data("ledid");
        var color = $("#led" + id + "-color").val();
        var brightness = $("#led" + id + "-brightness").val();
        $.ajax({
            type: "POST",
            url: "/v1/leds/" + id + "/" + color + "/" + brightness,
            crossDomain: true,
            success: function(responseData, status, xhr) {
                console.log("led " + id + " set to #" + color);
            },
            error: function(request, status, error) {
                console.log(error);
            }
        });
    });

    var led1Polling = setInterval(function ledStatus() {
        $.ajax({
            type: "GET",
            url: "/v1/leds/1",
            crossDomain: true,
            success: function(responseData, status, xhr) {
                $("#led1-icon").css("color", "#" + responseData.color);
                $("#led1-color-info").text(responseData.color);
                $("#led1-brightness-info").text(responseData.brightness);
                if (responseData.enabled) {
                    $("#led1-status").text("enabled");
                } else {
                    $("#led1-status").text("disabled");
                }
                return true;
            },
            error: function(request, status, error) {
                console.log(error);
                return false;
            }
        });
    }, 2000);

    var led2Polling = setInterval(function ledStatus() {
        $.ajax({
            type: "GET",
            url: "/v1/leds/2",
            crossDomain: true,
            success: function(responseData, status, xhr) {
                $("#led2-icon").css("color", "#" + responseData.color);
                $("#led2-color-info").text(responseData.color);
                $("#led2-brightness-info").text(responseData.brightness);
                if (responseData.enabled) {
                    $("#led2-status").text("enabled");
                } else {
                    $("#led2-status").text("disabled");
                }
                return true;
            },
            error: function(request, status, error) {
                console.log(error);
                return false;
            }
        });
    }, 2000);

    var led3Polling = setInterval(function ledStatus() {
        $.ajax({
            type: "GET",
            url: "/v1/leds/3",
            crossDomain: true,
            success: function(responseData, status, xhr) {
                $("#led3-icon").css("color", "#" + responseData.color);
                $("#led3-color-info").text(responseData.color);
                $("#led3-brightness-info").text(responseData.brightness);
                if (responseData.enabled) {
                    $("#led3-status").text("enabled");
                } else {
                    $("#led3-status").text("disabled");
                }
                return true;
            },
            error: function(request, status, error) {
                console.log(error);
                return false;
            }
        });
    }, 2000);

    var led4Polling = setInterval(function ledStatus() {
        $.ajax({
            type: "GET",
            url: "/v1/leds/4",
            crossDomain: true,
            success: function(responseData, status, xhr) {
                $("#led4-icon").css("color", "#" + responseData.color);
                $("#led4-color-info").text(responseData.color);
                $("#led4-brightness-info").text(responseData.brightness);
                if (responseData.enabled) {
                    $("#led4-status").text("enabled");
                } else {
                    $("#led4-status").text("disabled");
                }
                return true;
            },
            error: function(request, status, error) {
                console.log(error);
                return false;
            }
        });
    }, 2000);

});
