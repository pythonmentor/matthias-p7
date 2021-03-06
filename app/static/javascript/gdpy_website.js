// Html elements are stored and concealed.
var questionAnswerElt = document.getElementById("answers");
questionAnswerElt.style.display = "None";
var loadingIconElt = document.getElementById("loading_icon");
loadingIconElt.style.display = "None";

// This function returns the question previously asked by the visitor.
function returnQuestion(question) {
    var questionElt = document.createElement("p");
    var questionTextElt = document.createTextNode(
        "J'ai bien ententu, tu as demandé : " + question);
    questionElt.appendChild(questionTextElt);
    questionElt.classList.add("question");
    return questionElt;
}

/* This function returns the speech produced by Grandpy to this question :
 one of the different pre-existing answers (randomly chosen), and the exact
 address of the location found.*/
function returnSpeech(speech, coordinates) {
    var speechElt = document.createElement("p");
    var speechTextElt = document.createTextNode(
        "Et bien voilà ce que je peux te dire. " + speech);
    speechElt.appendChild(speechTextElt);
    /* The condition below checks if Grandpy obtained a positive answer. We
    don't want to display some empty elements. */
    if (coordinates[1] && coordinates[2]) {
        var addressElt = document.createTextNode(
            " Pour commencer, voici l'adresse : " + coordinates[0]);
        speechElt.appendChild(addressElt)
    }
    speechElt.classList.add("speech");
    return speechElt;
}

/* This function creates a map and its marker, according to the GPS
coordinates of the location found by the program.*/
function createMap(coordinates) {
    var mapElt = document.createElement("div");
    mapElt.classList.add("map");
    var myLatLng = {lat: coordinates[1], lng: coordinates[2]};
    var map = new google.maps.Map(mapElt, {
        zoom: 14,
        center: myLatLng
    });
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map
    });
    return mapElt;
}

/* This function returns the summary found by Grandpy on the wikipedia's
website.*/
function returnSummary(summary, url) {
    var summaryElt = document.createElement("p");
    summaryElt.classList.add("summary");
    summaryElt.innerHTML = summary + " ";
    var linkElt = document.createElement("a");
    linkElt.href = url;
    var knowMoreElt = document.createTextNode("En savoir plus. ");
    linkElt.appendChild(knowMoreElt);
    summaryElt.appendChild(linkElt);
    return summaryElt;
}

// This function returns all the previous elements as a global answer.
function addAnswer(question, answer) {
    // Elements of the general answer are created :
    var questionElt = returnQuestion(question);
    var speechElt = returnSpeech(answer.speech, answer.coords);

    // And then, included in a div "answer".
    var answerElt =document.createElement("div");
    answerElt.classList.add("answer");
    answerElt.appendChild(questionElt);
    answerElt.appendChild(speechElt);
    if (answer.coords[1] && answer.coords[2]) {
        var summaryElt = returnSummary(answer.summary, answer.url);
        var mapElt = createMap(answer.coords);
        answerElt.appendChild(summaryElt);
        answerElt.appendChild(mapElt);    
    }

    /* Lastly, the div "answer" is added to the div "answers", which goal is
    to contain all the questions and answers (until the page is
    refreshed or closed)*/
    var answersElt = document.getElementById("answers");
    answersElt.insertBefore(answerElt, answersElt.firstChild);
}

// Grandpy's answer and map appear when the form is submitted.
var formElt = document.getElementById("form");
formElt.addEventListener("submit", function(e) {
    e.preventDefault();
    var questionElt = document.querySelector("#gp_question");
    question = {
        question : questionElt.value
    };

    // The ajaxPost function uses all the previous functions.
    ajaxPost("/answer", question, function(reponse) {
        var question = questionElt.value;
        var data = JSON.parse(reponse);
        addAnswer(question, data);
    },
    true
    );

    // Replacing the form by a loading logo for 3 seconds:
    var divFormElt = document.querySelector("form");
    divFormElt.style.display = "None";
    loadingIconElt.style.display = "block";
    setTimeout(function() {
        divFormElt.style.display = "block";
        loadingIconElt.style.display = "none";    
    }, 3000);
    questionAnswerElt.style.display = "block";
}); 
