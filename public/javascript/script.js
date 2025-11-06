/**
 * Interactive CV JavaScript Module
 * Refactored and optimized version with modern practices
 */

// Configuration and constants
const CONFIG = {
    ANIMATION: {
        TYPED_SPEED: 100,
        SLIDE_DURATION: 500
    },
    LIMITS: {
        VISIBLE_JOBS: 4,
        SKILLS_PER_COLUMN: 3
    },
    CLASSES: {
        CHEVRON_DOWN: 'fas fa-angle-double-down fa-2x',
        CHEVRON_UP: 'fas fa-angle-double-up fa-2x'
    }
};

// HTML element templates
const HTML_TEMPLATES = {
    div: '<div></div>',
    span: '<span></span>',
    ol: '<ol></ol>',
    ul: '<ul></ul>',
    li: '<li></li>',
    p: '<p></p>',
    br: '<br></br>',
    hr: '<hr>',
    a: '<a></a>',
    strong: '<strong></strong>',
    h2: '<h2></h2>',
    h1: '<h1></h1>'
};

/**
 * Main application object with organized modules
 */
const CVApp = {
    
    /**
     * Initialize the application
     */
    init() {
        this.initTypedAnimation();
        this.initSmoothScroll();
        this.loadData();
    },

    /**
     * Initialize typed animation for name
     */
    initTypedAnimation() {
        if ($(".myname").length) {
            $(".myname").typed({
                strings: ["Anton ^100 Haman"],
                typeSpeed: CONFIG.ANIMATION.TYPED_SPEED,
                showCursor: true,
                cursorChar: '_',
                autoInsertCss: true
            });
        }
    },

    /**
     * Initialize smooth scroll functionality
     */
    initSmoothScroll() {
        $('#scroll').find('a').on('click', function (e) {
            e.preventDefault();
            const target = document.getElementById("profile");
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    },

    /**
     * Load data from API endpoints
     */
    async loadData() {
        try {
            const [careersData, skillsData] = await Promise.all([
                this.fetchData("/getCareersData"),
                this.fetchData("/getSkillsData")
            ]);
            
            this.renderSkills(skillsData);
            this.renderCareers(careersData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },

    /**
     * Fetch data with improved error handling
     */
    fetchData(path) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', path, true);
            request.timeout = 10000;
            
            request.onload = function() {
                if (request.status >= 200 && request.status < 300) {
                    try {
                        resolve(JSON.parse(request.responseText));
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error(`HTTP ${request.status}: ${request.statusText}`));
                }
            };
            
            request.onerror = () => reject(new Error('Network error'));
            request.ontimeout = () => reject(new Error('Request timeout'));
            
            request.send();
        });
    },

    /**
     * Render skills data with improved organization
     */
    renderSkills(response) {
        if (!response || !Array.isArray(response)) {
            console.error('Invalid skills data');
            return;
        }

        const skillsContainer = $('#skills').find('.row');
        if (!skillsContainer.length) {
            console.error('Skills container not found');
            return;
        }

        // Split skills into columns
        const skillColumns = [
            response.slice(0, CONFIG.LIMITS.SKILLS_PER_COLUMN),
            response.slice(CONFIG.LIMITS.SKILLS_PER_COLUMN, CONFIG.LIMITS.SKILLS_PER_COLUMN * 2)
        ];

        skillColumns.forEach(columnData => {
            if (columnData.length > 0) {
                const columnElement = this.createSkillColumn(columnData);
                skillsContainer.append(columnElement);
            }
        });

        this.renderDownloadButton(skillsContainer);
    },

    /**
     * Create a skill column element
     */
    createSkillColumn(skillsData) {
        const columnDiv = $(HTML_TEMPLATES.div).addClass('col-sm-6');

        skillsData.forEach(skillCategory => {
            const titleElement = $(HTML_TEMPLATES.h2)
                .addClass('text-left')
                .text(skillCategory.skill);
            
            const skillsList = $(HTML_TEMPLATES.ul).addClass('skills-list');
            
            skillCategory.skillList.forEach(skill => {
                const skillItem = this.createSkillItem(skill);
                skillsList.append(skillItem);
            });

            columnDiv.append(titleElement, skillsList);
        });

        return columnDiv;
    },

    /**
     * Create individual skill item with star rating
     */
    createSkillItem(skill) {
        const listItem = $(HTML_TEMPLATES.li);
        const skillName = $(HTML_TEMPLATES.span)
            .addClass('skill-name small')
            .text(skill.name);
        
        const skillLevel = $(HTML_TEMPLATES.span).addClass('skill-level');
        
        // Add filled stars
        for (let i = 0; i < skill.stars; i++) {
            $(HTML_TEMPLATES.span)
                .addClass('glyphicon glyphicon-star')
                .appendTo(skillLevel);
        }
        
        // Add empty stars
        const emptyStars = 5 - skill.stars;
        for (let i = 0; i < emptyStars; i++) {
            $(HTML_TEMPLATES.span)
                .addClass('glyphicon glyphicon-star-empty')
                .appendTo(skillLevel);
        }

        return listItem.append(skillName, skillLevel);
    },

    /**
     * Render download/print button
     */
    renderDownloadButton(parentElement) {
        const buttonContainer = $('<div class="col-sm-12 text-center no-print" id="download"></div>');
        const downloadButton = $('<a class="button" target="_blank">Download this CV in PDF</a>')
            .on('click', () => window.print());
        
        buttonContainer.append(downloadButton);
        parentElement.append(buttonContainer);
    },

    /**
     * Render careers data with improved organization and show/hide functionality
     */
    renderCareers(response) {
        if (!response || !Array.isArray(response)) {
            console.error('Invalid careers data');
            return;
        }

        const careersContainer = $('#careers').find('.row');
        if (!careersContainer.length) {
            console.error('Careers container not found');
            return;
        }

        const { jobs, mentoring } = this.categorizeJobs(response);
        
        // Add mentoring section if exists
        if (mentoring.length > 0) {
            const mentoringSection = this.createMentoringSection(mentoring);
            jobs.push(mentoringSection);
        }

        // Append all jobs
        jobs.forEach(jobElement => careersContainer.append(jobElement));

        // Setup show more/less functionality
        this.setupShowMoreFunctionality(jobs);
    },

    /**
     * Categorize jobs into regular jobs and mentoring
     */
    categorizeJobs(response) {
        const jobs = [];
        const mentoring = [];

        response.forEach(job => {
            const jobElement = this.createJobElement(job);
            
            if (job.mentoring === true) {
                mentoring.push(jobElement);
            } else {
                jobs.push(jobElement);
            }
        });

        return { jobs, mentoring };
    },

    /**
     * Create individual job element
     */
    createJobElement(job) {
        const container = $(HTML_TEMPLATES.div).addClass('container to-print');
        const workDiv = $(HTML_TEMPLATES.div).addClass('col-sm-6 col-xs-12 job');
        const detailsDiv = $(HTML_TEMPLATES.div).addClass('col-sm-6 col-xs-12 job-details');

        // Work information
        $(HTML_TEMPLATES.strong).text(job.workplace).appendTo(workDiv);
        $(HTML_TEMPLATES.br).addClass('print-only').appendTo(workDiv);
        $(HTML_TEMPLATES.p).addClass("small").text(job.date).appendTo(workDiv);

        // Job details
        $(HTML_TEMPLATES.strong).text(job.position).appendTo(detailsDiv);
        $(HTML_TEMPLATES.p).addClass("small").text(job.description).appendTo(detailsDiv);

        // Add responsibilities if available
        if (job.subtopic && job.responsibilities) {
            const responsibilitiesTitle = $(HTML_TEMPLATES.p)
                .addClass("small")
                .text(job.subtopic);
            
            const responsibilitiesList = $(HTML_TEMPLATES.ol)
                .attr('style', 'list-style-type:disc');
            
            job.responsibilities.forEach(responsibility => {
                $(HTML_TEMPLATES.li)
                    .addClass("small")
                    .text(responsibility)
                    .appendTo(responsibilitiesList);
            });

            detailsDiv.append(responsibilitiesTitle, responsibilitiesList);
        }

        return container.append(workDiv, detailsDiv);
    },

    /**
     * Create mentoring section
     */
    createMentoringSection(mentoringJobs) {
        const mentoringSection = $(HTML_TEMPLATES.div).addClass('row to-print');
        const title = $(HTML_TEMPLATES.h2).addClass('text-center').text("Mentoring");
        const hr = $(HTML_TEMPLATES.hr);
        
        mentoringSection.append(title, hr, ...mentoringJobs);
        return mentoringSection;
    },

    /**
     * Setup show more/less functionality for jobs
     */
    setupShowMoreFunctionality(jobs) {
        if (jobs.length <= CONFIG.LIMITS.VISIBLE_JOBS) {
            return; // No need for 'show more' if less than limit
        }

        let isHidden = false;
        const jobsToHide = [];
        
        if (jobs.length > CONFIG.LIMITS.VISIBLE_JOBS) {
            jobs.slice(CONFIG.LIMITS.VISIBLE_JOBS).forEach((elem) => {
                elem.hide();
                jobsToHide.push(elem);
                isHidden = true;
            });
            this.renderShowMoreButton(isHidden);
        }
        
        // Setup click handler
        $('#showMore').find('span').off('click').on('click', (e) => {
            e.preventDefault();
            
            if (isHidden) {
                isHidden = false;
                jobsToHide.forEach((e) => this.slideDown(e[0]));
                this.renderShowMoreButton(isHidden);
            } else {
                isHidden = true;
                jobsToHide.forEach((e) => this.slideUp(e[0]));
                this.renderShowMoreButton(isHidden);
                document.getElementById("careers").scrollIntoView({ behavior: 'smooth' });
            }
        });
    },

    /**
     * Render show more/less button
     */
    renderShowMoreButton(isHidden) {
        const mainSpan = $('#showMore').find('span');
        const icon = mainSpan.find("i");
        const paragraph = mainSpan.find("p");

        if (isHidden) {
            icon.removeClass().addClass(CONFIG.CLASSES.CHEVRON_DOWN);
            paragraph.text("Show more");
        } else {
            icon.removeClass().addClass(CONFIG.CLASSES.CHEVRON_UP);
            paragraph.text("Show less");
        }
    },

    /**
     * Slide up animation (restored original)
     */
    slideUp(target, duration = CONFIG.ANIMATION.SLIDE_DURATION) {
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
        
        setTimeout(() => {
            target.style.display = 'none';
            this.resetElementStyles(target);
        }, duration);
    },

    /**
     * Slide down animation (restored original)
     */
    slideDown(target, duration = CONFIG.ANIMATION.SLIDE_DURATION) {
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
        
        setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
        }, duration);
    },

    /**
     * Reset element styles after animation
     */
    resetElementStyles(element) {
        const stylesToRemove = [
            'height', 'overflow', 'transition-duration', 
            'transition-property', 'padding-top', 'padding-bottom',
            'margin-top', 'margin-bottom'
        ];
        
        stylesToRemove.forEach(style => {
            element.style.removeProperty(style);
        });
    }
};

// Initialize the application when DOM is ready
$(document).ready(() => {
    CVApp.init();
});