
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

    if (!(localStorage.getItem('webstartup.pagerank') == '0'))
	bg.pr();
    if (!(localStorage.getItem('webstartup.alexa') == '0'))
	bg.alexa();
    if (!(localStorage.getItem('webstartup.compete') == '0'))
	bg.compete();
    if (!(localStorage.getItem('webstartup.quantcast') == '0'))
	bg.quantcast();
    if (!(localStorage.getItem('webstartup.googlebl') == '0'))
	bg.googlebl();
    if (!(localStorage.getItem('webstartup.bingbl') == '0'))
	bg.bingbl();
    if (!(localStorage.getItem('webstartup.linkedin') == '0'))
	bg.linkedin();
    if (!(localStorage.getItem('webstartup.crunchbase') == '0')) {
	bg.crunchbase();
    }

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
    $('.ws_linkedin').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
    $('.ws_crunchbase').click(function() {
	chrome.tabs.create({'url': $(this).attr('href') });
    });
})