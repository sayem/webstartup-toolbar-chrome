/*

- light gray horizontal bar
- shade/hover ---- very light blue hover shade
- options menu formatting

*/


bg = chrome.extension.getBackgroundPage();

$(document).ready(function() {
    $('li').each(function() {
        var local_id = 'webstartup.' + this.id;
        var id = '#' + this.id;
        var link = '.ws_' + this.id;
        if (localStorage.getItem(local_id) == '0')
            $(id).hide();
        else 
            $(id).show();
    });

    if (localStorage.getItem('webstartup.pagerank') == '1')
	bg.pr();
    if (localStorage.getItem('webstartup.alexa') == '1')
	bg.alexa();
    if (localStorage.getItem('webstartup.compete') == '1')
	bg.compete();
    if (localStorage.getItem('webstartup.quantcast') == '1')
	bg.quantcast();
    if (localStorage.getItem('webstartup.googlebl') == '1')
	bg.googlebl();
    if (localStorage.getItem('webstartup.bingbl') == '1')
	bg.bingbl();
    if (localStorage.getItem('webstartup.yahoobl') == '1')
	bg.yahoobl();
    if (localStorage.getItem('webstartup.linkedin') == '1')
	bg.linkedin();
    if (localStorage.getItem('webstartup.crunchbase') == '1') {
	bg.crunchbase();
    }

    $('.ws_pagerank').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_alexa').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_compete').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_quantcast').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_googlebl').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_bingbl').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_yahoobl').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_linkedin').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_crunchbase').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
})