var colors = ["#ffff99", " #acefed", "#d2d4ec", "#f2b9e1", "#d2d4ec", "#f6c0c0", "#acefed", "#e5c180", "#3ee180"];


var active_object = null;
var user_select;
var fejl = 0;
var score_Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var score = 0;
var test_length = 3;
var markering_length;
var korrekt_array = [];

var json_streng;

$(document).ready(function() {

    enable_audio();
    rotateCheck();

    $(".ovelse_container").fadeOut(0);

    $(".dropout_container").fadeOut(0);


    $(".markering").click(function(e) {
        active_object = $(this).parent().parent().find('span').index(this);
        $(".brod_txt").off("click");

        if ($(this).hasClass("korrekt")) {
            console.log("Det er allerede korrekt!");
        } else {
            clicked_word($(this), e);
        }
    });

    $(".videolink").click(function() {
        showSource("video")
    });
    $(".textlink").click(function() {
        showSource("tekst")
    });
    /*$(".brod_txt").click(function() {
        console.log("clicked brød")
        UserMsgBox("body", "Du har klikket et sted, hvor der ikke umiddelbart er nogle ord, der siger noget om billedsprog");
        fejl++;
        check_answers();
    });*/

    //$(".close_dropout").click(hide_dropout);
    // $(".checkAnswer").click(check_answers);

    //init();

});

function init() {
    $(".tekst_container").append("<div class='brod_txt textHolder'>" + JsonObj[0].tekst + "</div>");
    $(".textHolder").append("<div class='textHolder_gradient'></div>");
    // $(".instr_container").prepend("<h1>" + JsonObj[0].title + "</h1><h4 class='instruktion'><span class='glyphicon glyphicon-arrow-right'></span>" + JsonObj[0].Instruktion + "</h4>")
    // $(".instr_container").prepend("<h1>" + JsonObj[0].title + "</h1>" + instruction(JsonObj[0].Instruktion_1));  // THAN: Commented out 01-07-2016
    $(".instr_container").prepend("<h1>" + JsonObj[0].title + "</h1>" + '<div class="col-xs-12 col-md-8">'+ instruction(JsonObj[0].Instruktion_1) +'</div><div class="clear"></div>');  // THAN: Added 01-07-2016

    $('#explanationWrapper').html(explanation(JsonObj[0].explanation));

    // fyld knapperne op med den data der findes i json filen:
    for (var i = 0; i < JsonObj[0].kategorier.length; i++) {
        var numberOfAnswers = allIndexOf(json_streng, 'svar_' + i);
        $(".klasse_container").append('<div class="box_select"><div class = "box">' + "<span class='glyphicons glyphicons-circle-info'></span>" + JsonObj[0].kategorier[i] + '<span class="span_score">0/' + numberOfAnswers + '</span></div ></div>');

        $(".drop_left").append('<div class="dropout">' + JsonObj[0].kategorier[i] + '</div >');
    }
    markering_length = $(".markering").length;
    $(".klasse_container").append('<div class="score_container"><span class="scoreText">Korrekte svar: </span><span class="QuestionCounter QuestionTask">0 ud af ' + markering_length + '</span> <span class="scoreText"> Forsøg: </span><span class="ErrorCount QuestionTask">0</span>');

    $(".tekst_container").append("<div class='kildeContainer'><b style='color:black'>KILDE:</b> " + JsonObj[0].kilde) + "</div>";


    // load tesksten ind:
    $(".box").each(function(index) {
        $(this).css("background-color", colors[index]);
    });
    $(".dropout").each(function(index) {
        $(this).css("background-color", colors[index]);
    });   

    $(".box_select").click(function() {
        clicked_forklaring($(this));
    });
    $(".btn_snyd").click(function() {
        snyd();
    });
};

function clicked_forklaring(obj) {

    if (obj.attr("class") == "txt_select") {
        var indeks = obj.index();
    } else {
        var indeks = obj.index()-1;
    }


    UserMsgBox("body", "<h3>" + JsonObj[0].kategorier[indeks] + "</h3><h4>" + JsonObj[0].forklaring[indeks] + "</h4>");
}

function clicked_word(clicked_object, pos) {
    //clicked_object.css("text-decoration", "underline");
    var instr_height = $(".instr_container").height();

    var offset = $(".container-fluid").offset();
    var posX = pos.pageX; // - offset.left + 10;
    var posY = pos.pageY - (instr_height + 30);




    //console.log("posY: " + posY + ", offset.top: " + offset.top);

    show_dropdown(posX, posY);
}


function show_dropdown(posX, posY) {
    UserMsgBox("body", "");
    $(".drop_left").show();
    var active_sentence = $(".markering").eq(active_object).html();
    var dp = "<div class='drop_right col-xs-6 col-sm-6'><h3 class='drop_out_header'>Vælg kategori for: </h3><span class='h4 drop_spm'>&quot;" + active_sentence + "&quot;</span><div class ='drop_feedback'></div></div>" + $(".dropout_container").html() + "";
    $("#UserMsgBox").append(dp);
    //$(".dropout_container").fadeIn(100); //.css("position", "absolute").css("left", posX).css("top", posY);
    //$(".drop_out_header").html("Vælg den rigtige kategori til: <br/><h3>" + $(".markering").eq(active_object).html() + "</h3>");
    $(".dropout").show();

    $(".dropout").click(function() {
        clicked_dropout($(this));
    });
    $(".dropout").hover(function() {
        var indeks = $(this).index();
        user_select = indeks;
        console.log("user_select:  " + indeks)
        $(".drop_spm").css("background-color", colors[indeks]);
    });

    $(".dropout").mouseleave(function() {
        $(".drop_spm").css("background-color", "transparent");
    });


    $(".MsgBox_bgr").off("click");

    $(".glyphicon-remove").click(function() {
        $(".MsgBox_bgr").fadeOut(200, function() {
            $(this).remove();
        });
    });

}







function clicked_dropout(objekt) {
    var indeks = objekt.index();
    //console.log("clicked: " + indeks)



    //hide_dropout();
    check_answers();
}

function hide_dropout() {
    //$(".markering").css("text-decoration", "none");
    $(".dropout_container").fadeOut(100);

    $(".brod_txt").click(function() {
        UserMsgBox("body", "Der er ikke nogen vigtige ord her");
    });

    $(".dropout").off("click");

}

function check_answers() {

    $(".feedback_container").remove();

    console.log("user_select: " + user_select);
    var click = 0;
    fejl++;

    //score_Array = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    //score = 0;

    var fejl_i_svar = false;
    var f_faglig = false;
    var antal_klasser = $(".markering").eq(active_object).attr('class').split(' ').length;
    korrekt_array = [];

    if (antal_klasser > 2) {
        f_faglig = true;

        for (var i = 1; i < antal_klasser; i++) {
            korrekt_val = $(".markering").eq(active_object).attr('class').split(' ')[i];
            korrekt_val = parseInt(korrekt_val.substring(korrekt_val.length - 1, korrekt_val.length));
            korrekt_array.push(korrekt_val);
        }

    } else {
        var korrekt = $(".markering").eq(active_object).attr('class').split(' ')[1];
        korrekt = parseInt(korrekt.substring(korrekt.length - 1, korrekt.length))

    }

    if (korrekt == user_select || korrekt_array.indexOf(user_select) > -1) {
        console.log("korrekt: " + korrekt + ", korrekt_array:" + korrekt_array + ", f_faglig = " + f_faglig);

        correct_sound();

        $(".drop_left").hide();
        $(".drop_out_header, .drop_spm").hide();

        $(".markering").eq(active_object).addClass("korrekt");

        //$(".dropout, .drop_out_header, .drop_spm").hide();
        if (f_faglig == false) {
            $(".drop_feedback").html("<h3>Du har svaret <span class='label label-success'>Korrekt</span> </h3>");
            $(".markering").eq(active_object).attr("value", user_select).css("background-color", colors[user_select]).css("text-decoration", "none");
            $("#UserMsgBox").append("<h4 class='col-xs-12 feedback_container'>Markeringen <em>''" + $(".markering").eq(active_object).html() + "'' </em> er relevant for <b>" + $(".dropout").eq(user_select).html().toLowerCase() + "</b>.<br/><br/>" + JsonObj[0].feedback[active_object] + "</h4");
        } else {
            var korrekte_fag_string = "";

            antal_klasser = antal_klasser - 2;

            for (var i = 0; antal_klasser > i; i++) {

                console.log(antal_klasser + ", i: " + i)

                //der er to yderligere fag (hvis antal-klasser - 1 er større end 1)
                if (antal_klasser - i > 2) {
                    korrekte_fag_string = korrekte_fag_string + "<b>" + JsonObj[0].kategorier[korrekt_array[i]] + "</b>, ";
                } else if (antal_klasser - i == 2) {
                    //case: der er 1 yderligere fag (hvis antal-klasser - 1 er større end 1)
                    korrekte_fag_string = korrekte_fag_string + "<b>" +JsonObj[0].kategorier[korrekt_array[i]] + "</b> og ";
                } else if (antal_klasser - i < 2) {
                    console.log("//case: der ikke yderligere fag at remse op");
                    korrekte_fag_string = korrekte_fag_string + "<b>" + JsonObj[0].kategorier[korrekt_array[i]] + "</b>.";
                }
            }

            korrekte_fag_string = korrekte_fag_string.toLowerCase(); 

            if (user_select == 3) {

                $(".drop_feedback").html("<h3>Du har svaret <span class='label label-success'>Korrekt</span> </h3>");
                $("#UserMsgBox").append("<h4 class='col-xs-12 feedback_container'>Markeringen <em>''" + $(".markering").eq(active_object).html() + "'' </em> har <b>" + $(".dropout").eq(user_select).html().toLowerCase() + "</b> relevans. <br/>Tekststykket er både relevant for   " + korrekte_fag_string + "<br/><br/>" + JsonObj[0].feedback[active_object] + "</h4");
            } else {
                $(".drop_feedback").html("<h3>Du har svaret <span class='label label-success'>Delvist korrekt</span> </h3>");
                $("#UserMsgBox").append("<h4 class='col-xs-12 feedback_container'>Markeringen <em>''" + $(".markering").eq(active_object).html() + "'' </em> tilhører kategorien <b>fællesfaglig</b>. <br/>Tekststykket er relevant for både " + korrekte_fag_string + "<br/><br/>" + JsonObj[0].feedback[active_object] + "</h4");
            }
            $(".markering").eq(active_object).attr("value", user_select).css("background-color", colors[3]).css("text-decoration", "none");
        }

        new_score = score_Array[korrekt] + 1;
        score_Array.splice(korrekt, 1, new_score);
        score++;

        $(".MsgBox_bgr").click(function() {
            click++;
            if (click > 1) {
                $(this).fadeOut(300, function() {
                    $(this).remove();
                    // Animation complete.
                });
                if (score >= markering_length) {
                    slutfeedback();
                }


                $(".box").eq(user_select).animate({
                    opacity: "0",
                }, 0, "linear", function() {
                    $(".span_score").each(function(index) {
                        var string = $(this).text();
                        string = score_Array[index] + string.substring(1, string.length);
                        //console.log(string);
                        //string.replace(0, score_Array[index]);
                        $(this).html(string)
                    });
                    $(".box").eq(user_select).animate({
                        opacity: "1",

                    }, 500, "linear", function() {

                    });
                });


            }
        });


        $(".QuestionCounter").html(score + " ud af " + markering_length);


    } else if (korrekt != user_select || korrekt_array.indexOf(user_select) < 0) {

        console.log("error / f_faglig = " + f_faglig + "Korrekt: " + korrekt + "usr select: " + user_select);

        $(".drop_feedback").html("<h3>Du har svaret <span class='label label-danger'>Forkert</span> </h3>");
        $("#UserMsgBox").append("<h4 class='col-xs-12 feedback_container'> Markeringen <em>''" + $(".markering").eq(active_object).html() + "'' </em>tilhører ikke kategorien <b>" + $(".dropout").eq(user_select).html().toLowerCase() + "</b>.</h4>");
        error_sound();

        $(".markering").eq(active_object).animate({
            backgroundColor: "#e7e6e2"
        }, 200, function() {
            $(".markering").eq(active_object).removeAttr("value").css("background-color", "e7e6e2");
        });

        fejl_i_svar = true;
    }
    //console.log("korrekt: " + korrekt + ", svar: " + svar);

    $(".ErrorCount").html(fejl);

}


function loadData(url) {
    $.ajax({
        url: url,
        // contentType: "application/json; charset=utf-8",  // Blot en test af tegnsaettet....
        //dataType: 'json', // <------ VIGTIGT: Saadan boer en angivelse til en JSON-fil vaere! 
        dataType: 'text', // <------ VIGTIGT: Pga. ???, saa bliver vi noedt til at angive JSON som text. 
        async: false, // <------ VIGTIGT: Sikring af at JSON hentes i den rigtige raekkefoelge (ikke asynkront). 
        success: function(data, textStatus, jqXHR) {
            JsonObj = jQuery.parseJSON(data);
            // Alt data JsonObj foeres over i arrays:


            //$(".correct").html("Correct answers: <b>" + score + " / " + antal_korrekte + " </b> Attempts: <b>" + attempts + "</b>");
            //next_round();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error!!!\njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
        }
    });
    json_streng = JSON.stringify(JsonObj);


    init();
}

function slutfeedback() {
    UserMsgBox("body", JsonObj[0].slutfeedback + "</p><div class='btn btn-primary btn-again'>PRØV IGEN</div>");
    $(".btn-again").click(function() {
        location.reload();
    });
}

function snyd() {

    $(".markering").each(function(index) {
        $(this).hide();
    });
}

function showSource(source) {


    if (source == "video") {
        UserMsgBox('body', JsonObj[0].tekst_msg_header + "<em>" + JsonObj[0].tekstforklaring + '</em><br/><div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="' + JsonObj[0].videolink + '"></iframe></div><div class="btn btn-info btn_ready">Jeg er klar til at gå i gang med opgaven</div>');
        //$("#UserMsgBox").prepend(JsonObj[0].tekstforklaring);
        
    } else if (source == "tekst") {

        UserMsgBox("body", JsonObj[0].tekst_msg_header + "<em>" + JsonObj[0].tekstforklaring + "</em><br/>" + JsonObj[0].tekst_msg + "<div class='btn btn-info btn_ready'>Jeg er klar til at gå i gang med opgaven</div>");
        //$("#UserMsgBox").prepend();
    }
    $(".MsgBox_bgr").off("click");

    $(".btn_ready, .CloseClass").click(function() {

        $(".MsgBox_bgr").fadeOut(function() {
            // $(".instr_container").html("<h1>" + JsonObj[0].title + "</h1>" + instruction(JsonObj[0].Instruktion_2));  // THAN: Commented out 01-07-2016
            $(".instr_container").html("<h1>" + JsonObj[0].title + "</h1>" + '<div class="col-xs-12 col-md-8">'+ instruction(JsonObj[0].Instruktion_2) +'</div><div class="clear"></div>');     // THAN: Added 01-07-2016
            $(".txt_select").each(function(index) {
        $(this).css("background-color", colors[index]);
    });
   

    $(".box_select, .txt_select").click(function() {
        clicked_forklaring($(this));
    });
            $(".ovelse_container").fadeIn(1000);
            $(".MsgBox_bgr").remove();
        });
    });
}
