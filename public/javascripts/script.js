const htmlElements = {
    div: '<div></div>',
    span: '<span></span>',
    ol: '<ol></ol>',
    ul: '<ul></ul>',
    li: '<li></li>',
    p: '<p></p>',
    br: '<br</br>',
    a: '<a></a>',
    strong: '<strong></strong>',
    h2: '<h2></h2>'
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
    skills.push(renderSkill(response.slice(0, 3)));
    skills.push(renderSkill(response.slice(3, 6)));

    let parentElem = $('#skills').find('.row');
    skills.forEach(elem => parentElem.append(elem));
    renderButton(parentElem);
}

function renderSkill(slicedResp) {
    let skillDiv = $(htmlElements.div).addClass('col-sm-6');

    slicedResp.forEach(skillElem => {
        let skillTitleElem = $(htmlElements.h2).addClass('text-left');
        skillTitleElem.text(skillElem.skill).appendTo(skillDiv);
        let skillListUl = $(htmlElements.ul).addClass('skills-list');

        skillElem.skillList.forEach(elem => renderSkillStars(elem).appendTo(skillListUl));
        skillDiv.append(skillListUl);
    });
    return skillDiv;
}

function renderSkillStars(elem) {
    let skillLevel = $(htmlElements.span).addClass('skill-level');
    let liElem = $(htmlElements.li);
    liElem.append($(htmlElements.span).addClass('skill-name small').text(elem.name));

    let emptyStars = 5 - elem.stars;
    for (let i = 1; i <= elem.stars; i++) {
        $(htmlElements.span).addClass('glyphicon glyphicon-star').appendTo(skillLevel);
    }
    for (let i = 1; i <= emptyStars; i++) {
        $(htmlElements.span).addClass('glyphicon glyphicon-star-empty').appendTo(skillLevel);
    }
    skillLevel.appendTo(liElem);
    return liElem;
}

function renderButton(parentElem) {
    let divContainer = $(htmlElements.div).addClass('col-sm-12 text-center no-print');
    $(htmlElements.p).addClass('small')
        .attr('id', 'cv-legend')
        .text('Here is my CV in PDF')
        .appendTo(divContainer);
    $(htmlElements.a).addClass('button')
        .attr('href', '/documents/CV_Anton_Haman.pdf')
        .attr('target', '_blank')
        .text('CV')
        .appendTo(divContainer);
    parentElem.append(divContainer);
}

function renderCareers(response) {
    let jobs = [];
    response.forEach(function (respElem) {
        let divWork = $(htmlElements.div).addClass('col-sm-6 col-xs-12 job');
        let divDetails = $(htmlElements.div).addClass('col-sm-6 col-xs-12 job-details');

        $(htmlElements.strong).text(respElem.workplace).appendTo(divWork);
        $(htmlElements.br).addClass('print-only').appendTo(divWork);
        $(htmlElements.p).addClass("small").text(respElem.date).appendTo(divWork);
        $(htmlElements.strong).text(respElem.position).appendTo(divDetails);
        $(htmlElements.p).addClass("small").text(respElem.description).appendTo(divDetails);

        if (respElem.subtopic !== undefined) {
            let responsibilitiesList = $(htmlElements.ol).attr('style', 'list-style-type:disc');
            $(htmlElements.p).addClass("small").text(respElem.subtopic).appendTo(divDetails);
            respElem.responsibilities.forEach(function (elem) {
                $(htmlElements.li).addClass("small").text(elem).appendTo(responsibilitiesList);
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