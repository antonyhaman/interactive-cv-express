const htmlElements = {
    workplaceDiv: '<div class="col-sm-6 col-xs-12 job"></div>',
    jobDetailsDiv: '<div class="col-sm-6 col-xs-12 job-details"></div>',
    responsibilitiesList: '<ol style="list-style-type:disc"></ol>',
    listElement: '<li></li>',
    paragraph: '<p></p>',
    strong: '<strong></strong>',
    skillDiv: '<div class="col-sm-6"></div>',
    skillTitle: '<h2 class="text-left"></h2>',
    skillUnorderedList: '<ul class="skills-list"></ul>',
    skillLevel: '<span class="skill-level"></span>'
};

$(function () {
    $(".myname").typed({
        strings: ["Anton Haman"],
        typeSpeed: 100,
        showCursor: false,
    });
});

$(function () {
    $('#scroll').find('a').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $($(this).attr('href')).offset().top}, 400, 'linear');
    });
});

$(function () {
    $(document).ready(function () {
        $.getJSON("/getCareersData", function (response) {
            renderCareers(response);
        });
        $.getJSON("/getSkillsData", function (response) {
            renderSkills(response);
        })
    });
});

function renderSkills(response) {
    let skills = [];
    skills.push(renderSkill(response.slice(0,3)));
    skills.push(renderSkill(response.slice(3,6)));

    let parentElem = $('#skills').find('.row');
    skills.forEach(elem => parentElem.append(elem));
    renderButton(parentElem);
}

function renderSkill(slicedResp) {
    let skillDiv = $(htmlElements.skillDiv);

    slicedResp.forEach(skillElem => {
        let skillTitleElem = $(htmlElements.skillTitle);
        skillTitleElem.text(skillElem.skill).appendTo(skillDiv);
        let skillListUl = $(htmlElements.skillUnorderedList);

        skillElem.skillList.forEach(elem => renderSkillStars(elem).appendTo(skillListUl));
        skillDiv.append(skillListUl);
    });
    return skillDiv;
}

function renderSkillStars(elem) {
    let skillLevel = $(htmlElements.skillLevel);
    let liElem = $(htmlElements.listElement);
    liElem.append($('<span class="skill-name small"></span>').text(elem.name));

    let emptyStars = 5 - elem.stars;
    for (let i = 1; i <= elem.stars; i++) {
        $('<span class="glyphicon glyphicon-star"></span>').appendTo(skillLevel);
    }
    for (let i = 1; i <= emptyStars; i++) {
        $('<span class="glyphicon glyphicon-star-empty"></span>').appendTo(skillLevel);
    }
    skillLevel.appendTo(liElem);
    return liElem;
}

function renderButton(parentElem) {
    let divContainer = $('<div class="col-sm-12 text-center no-print"></div>');
    $('<p id="cv-legend" class="small">Here is my CV in PDF</p>').appendTo(divContainer);
    $('<a class="button" href="javascript:window.print()" target="_blank">CV</a>').appendTo(divContainer);
    parentElem.append(divContainer);
}

function renderCareers(response) {
    let jobs = [];
    response.forEach(function (respElem) {
        let divWork = $(htmlElements.workplaceDiv);
        let divDetails = $(htmlElements.jobDetailsDiv);

        $(htmlElements.strong).text(respElem.workplace).appendTo(divWork);
        $('<br class="print-only">').appendTo(divWork);
        $(htmlElements.paragraph).addClass("small").text(respElem.date).appendTo(divWork);
        $(htmlElements.strong).text(respElem.position).appendTo(divDetails);
        $(htmlElements.paragraph).addClass("small").text(respElem.description).appendTo(divDetails);


        if (respElem.subtopic !== undefined) {
            let responsibilitiesList = $(htmlElements.responsibilitiesList);
            $(htmlElements.paragraph).addClass("small").text(respElem.subtopic).appendTo(divDetails);
            respElem.responsibilities.forEach(function (elem) {
                $(htmlElements.listElement).addClass("small").text(elem).appendTo(responsibilitiesList);
            });
            divDetails.append(responsibilitiesList);
        }

        jobs.push(divWork);
        jobs.push(divDetails);
    });

    jobs.forEach(function (elem) {
        $('#careers').find('.row').append(elem);
    })
}