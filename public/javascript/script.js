const htmlElements = {
    div: '<div></div>',
    span: '<span></span>',
    ol: '<ol></ol>',
    ul: '<ul></ul>',
    li: '<li></li>',
    p: '<p></p>',
    br: '<br</br>',
    hr: '<hr>',
    a: '<a></a>',
    strong: '<strong></strong>',
    h2: '<h2></h2>',
    h1: '<h1></h1>'
};

$(function () {
    $(".myname").typed({
        strings: ["Anton ^100 Haman"],
        typeSpeed: 100,
        showCursor: true,
        cursorChar: '_',
        autoInsertCss: true
    });
});

$(function () {
    $('#scroll').find('a').on('click', function (e) {
        e.preventDefault();
        document.getElementById("profile").scrollIntoView()
    });
});

$(function () {
        doGetRequest("/getCareersData", renderCareers);
        doGetRequest("/getSkillsData", renderSkills);
});


function doGetRequest(path, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', path, true);

    request.onload = function() {
        callback(JSON.parse(request.responseText));
    }
    request.send();
}

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
    let divContainer = $('<div class="col-sm-12 text-center no-print" id="download"></div>');
    $('<a class="button" target="_blank">Download this CV in PDF</a>').appendTo(divContainer).on('click', () => window.print());
    parentElem.append(divContainer);
}

function renderCareers(response) {
    let jobs = [];
    let mentoring = []
    response.forEach(function (respElem) {
            let container = $(htmlElements.div).addClass('container to-print');
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
        container.append(divWork, divDetails);
        if (respElem.mentoring === true) {
            mentoring.push(container);
        }
        else {
            jobs.push(container);
        }
    })

    let divRow = $(htmlElements.div).addClass('row').addClass('to-print');
    divRow.append($(htmlElements.h2).addClass('text-center').text("Mentoring"));
    divRow.append($(htmlElements.hr));
    divRow.append(mentoring);
    jobs.push(divRow);
    jobs.forEach(function (elem) {
        $('#careers').find('.row').append(elem);
    });

    let isHidden = false;
    let jobsToHide = [];
    if (jobs.length > 4) {
        jobs.slice(4).forEach((elem) => {
            elem.hide();
            jobsToHide.push(elem);
            isHidden = true;
        });
        renderShowMoreBlock(isHidden);
    }
    $('#showMore').find('span').on('click', function (e) {
        e.preventDefault();
        if (isHidden) {
            isHidden = false;
            jobsToHide.forEach((e) => slideDown(e[0]));
            renderShowMoreBlock(isHidden);
        }
        else {
            isHidden = true;
            jobsToHide.forEach((e) => slideUp(e[0]));
            renderShowMoreBlock(isHidden);
            document.getElementById("careers").scrollIntoView()
        }
    });
}

function renderShowMoreBlock(isHidden) {
    let mainSpan = $('#showMore').find('span');
    let icon = mainSpan.find("i");
    let paragraph = mainSpan.find("p");

    let chevronDownClass = 'fas fa-angle-double-down fa-2x';
    let chevronUpClass = 'fas fa-angle-double-up fa-2x"';

    if (isHidden) {
        icon.removeClass(icon.attr("class"));
        icon.addClass(chevronDownClass);
        paragraph.text("Show more")
    }
    else {
        icon.removeClass(icon.attr("class"));
        icon.addClass(chevronUpClass);
        paragraph.text("Show less");
    }
}

let slideUp = (target, duration=500) => {
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.boxSizing = 'border-box';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout( () => {
              target.style.display = 'none';
              target.style.removeProperty('height');
              target.style.removeProperty('padding-top');
              target.style.removeProperty('padding-bottom');
              target.style.removeProperty('margin-top');
              target.style.removeProperty('margin-bottom');
              target.style.removeProperty('overflow');
              target.style.removeProperty('transition-duration');
              target.style.removeProperty('transition-property');
              //alert("!");
        }, duration);
    }

    /* SLIDE DOWN */
let slideDown = (target, duration=500) => {
        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none') display = 'block';
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout( () => {
          target.style.removeProperty('height');
          target.style.removeProperty('overflow');
          target.style.removeProperty('transition-duration');
          target.style.removeProperty('transition-property');
        }, duration);
    }