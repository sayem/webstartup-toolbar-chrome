
function getHost(url) {
    var host = url.replace(/^https{0,1}:\/\//, '');
    host = host.replace(/^www\./, '');
    host = host.replace(/^www[a-z,0-9,A-Z]\./, '');
    host = host.replace(/\/.*/,'');
    return host;
}

function getXmlHttpObject() {
    return new XMLHttpRequest();
}

function StrToNum(Str, Check, Magic) {
    var Int32Unit = 4294967296;
    var length = Str.length;
    for (var i = 0; i < length; i++) {
	Check *= Magic;
	if (Check >= Int32Unit) {
            Check = (Check - Int32Unit * parseInt(Check / Int32Unit));
            Check = (Check < -2147483648) ? (Check + Int32Unit) : Check;
	}
	Check += Str.charCodeAt(i);
    }
    return Check;
}

function HashURL(String) {
    var Check1 = StrToNum(String, 0x1505, 0x21);
    var Check2 = StrToNum(String, 0, 0x1003F);
    Check1 >>= 2;
    Check1 = ((Check1 >> 4) & 0x3FFFFC0) | (Check1 & 0x3F);
    Check1 = ((Check1 >> 4) & 0x3FFC00) | (Check1 & 0x3FF);
    Check1 = ((Check1 >> 4) & 0x3C000) | (Check1 & 0x3FFF);
    var T1 = ((((Check1 & 0x3C0) << 4) | (Check1 & 0x3C)) << 2) | (Check2 & 0xF0F);
    var T2 = ((((Check1 & 0xFFFFC000) << 4) | (Check1 & 0x3C00)) << 0xA) | (Check2 & 0xF0F0000);
    return (T1 | T2);
}

function CheckHash(Hashnum) {
    var CheckByte = 0;
    var Flag = 0;
    var HashStr;
    if (Hashnum < 0) HashStr = 4294967296 + Hashnum;
    else HashStr = Hashnum;
    HashStr = HashStr + '';
    var length = HashStr.length;
    for (var i = length - 1; i >= 0; i--) {
	Re = HashStr.charCodeAt(i) - 48;
	if ((Flag % 2) == 1) {
            Re += Re;
            Re = parseInt(Re / 10) + (Re % 10);
	}
	CheckByte += Re;
	Flag++;
    }
    CheckByte %= 10;
    if (CheckByte != 0) {
	CheckByte = 10 - CheckByte;
	if ((Flag % 2) == 1) {
            if ((CheckByte % 2) == 1) {
		CheckByte += 9;
            }
            CheckByte >>= 1;
	}
    }
    return '7' + CheckByte + '' + HashStr;
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
	x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function isInt(num) {
    if (num.toString().search(/^-?[0-9,\.(B)?(M)?(K)?]+$/) == 0)
	return true;
    else
	return false;
}

/////////////////////////////////////////////////////////////////////////


function pr() {
    chrome.tabs.getSelected(null, function(tab) {
	var currUrl = getHost(tab.url);
        workingURL = 'http://toolbarqueries.google.com/tbr?client=navclient-auto&ch=' + CheckHash(HashURL(currUrl)) + '&features=Rank&q=info:' + encodeURIComponent(currUrl) + '&num=100&filter=0';
        prxmlhttp = getXmlHttpObject();
        prxmlhttp.onreadystatechange = function () {
            if (prxmlhttp.readyState == 4 && prxmlhttp.status == 200) {
                var rt = prxmlhttp.responseText;
                var pr = rt.substr(rt.lastIndexOf(':') + 1);
                pr = pr.substr(0, pr.length - 1);
                if (isInt(pr)) pr = pr + '/10';
                else pr = 'n/a';
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
		    var popup = popups[0];
		    popup.ws_pagerank.setAttribute("title", 'Google PageRank: ' + pr);
		    popup.ws_pagerank.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>Google PageRank: </span>" + pr);
		}
            }
        };
        prxmlhttp.open("GET", workingURL, true);
        prxmlhttp.send(null);
    });
}

function alexa() {
    chrome.tabs.getSelected(null, function(tab) {
	var currUrl = getHost(tab.url);
	workingURL = 'http://xml.alexa.com/data?cli=10&dat=nsa&url=' + encodeURIComponent(currUrl);
	alexaxmlhttp = getXmlHttpObject();
	alexaxmlhttp.onreadystatechange = function () {
  if (alexaxmlhttp.readyState == 4 && alexaxmlhttp.status == 200) {
    var rt = alexaxmlhttp.responseText;
    var offset = rt.indexOf('<POPULARITY');
    var start = rt.indexOf('TEXT="', offset);
    var end = rt.indexOf('"', start + 6);
    var alexa;
    if (start == -1 || end == -1) alexa = 'n/a';
    else {
      if (isInt(rt.substr(start + 6, end - start - 6))) alexa = addCommas(rt.substr(start + 6, end - start - 6));
      else alexa = 'n/a';
    }
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
		    var popup = popups[0];
		    popup.ws_alexa.setAttribute("title", 'Alexa Rank: ' + alexa);
		    popup.ws_alexa.childNodes[1].setAttribute('href', 'http://alexa.com/siteinfo/' + currUrl);
		    popup.ws_alexa.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>Alexa Rank: </span>" + alexa);
		}
            }
	};
	alexaxmlhttp.open("GET", workingURL, true);
	alexaxmlhttp.send(null);
    });
}

function compete() {
    chrome.tabs.getSelected(null, function(tab) {
	var currUrl = getHost(tab.url);
	workingURL = 'http://data.compete.com/fast-cgi/MI?size=small&ver=3&d=' + encodeURIComponent(currUrl);
	competexmlhttp = getXmlHttpObject();
	competexmlhttp.onreadystatechange = function () {
            if (competexmlhttp.readyState == 4 && competexmlhttp.status == 200) {
		var rt = competexmlhttp.responseText;
		var start = rt.indexOf('<count');
		var end = rt.indexOf('</count');
		var count = rt.substr(start + 7, end - start - 7).replace(/^\s+|\s+$/g,"");
		var compete;
		if (count == 0) compete = 'n/a';
		else if (count.length > 7) {
		    if (isInt(count.slice(0,-8))) compete = count.slice(0,-8) + 'M';
		    else compete = 'n/a';
		}  
		else if (count.length > 3) {
		    if (isInt(count.slice(0,-4))) compete = count.slice(0,-4) + 'K';
		    else compete = 'n/a';
		}
		else compete = count;
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
		    var popup = popups[0];
		    popup.ws_compete.setAttribute("title", 'Compete, Monthly Uniques: ' + compete);
		    popup.ws_compete.childNodes[1].setAttribute('href', 'http://siteanalytics.compete.com/' + currUrl);
		    popup.ws_compete.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>Compete, Monthly Uniques: </span>" + compete);
		}
            }
	};
	competexmlhttp.open("GET", workingURL, true);
	competexmlhttp.send(null);
    });
}

function quantcast() {
    chrome.tabs.getSelected(null, function(tab) {
	var currUrl = getHost(tab.url);
	workingURL = 'http://quantcast.com/' + encodeURIComponent(currUrl);
	qcxmlhttp = getXmlHttpObject();
	qcxmlhttp.onreadystatechange = function () {
            if (qcxmlhttp.readyState == 4 && qcxmlhttp.status == 200) {
		var rt = qcxmlhttp.responseText;
		var start = rt.indexOf('reach-wd');
		var quantcast;
		if (rt.indexOf('class="label">Global People') == -1) {
		    var us = rt.indexOf('>', start);
		    var end = rt.indexOf('<', us);
		    if (rt.substr(us + 1, end - us - 1).replace(/^\s+|\s+$/g,"") == "N/A") quantcast = 'n/a';
		    else if (us + 2 == end) quantcast = "n/a";
		    else 
			if (isInt(rt.substr(us + 1, end - us - 1).replace(/^\s+|\s+$/g,""))) 
			    quantcast = rt.substr(us + 1, end - us - 1).replace(/^\s+|\s+$/g,"");
		}
		else if (rt.indexOf('class="label">Global People') > 0) {
		    var global = rt.indexOf('"reach">', start);
		    var end = rt.indexOf('<p class="label"', global);
		    if (rt.substr(global + 8, end - global - 8).replace(/^\s+|\s+$/g,"") == "N/A") quantcast = 'n/a';
		    else if (global + 9 == end) quantcast = "n/a";
		    else 
			if (isInt(rt.substr(global + 8, end - global - 8).replace(/^\s+|\s+$/g,"")))
			    quantcast = rt.substr(global + 8, end - global - 8).replace(/^\s+|\s+$/g,"");
		}      
		else quantcast = "n/a";
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
		    var popup = popups[0];
		    popup.ws_quantcast.setAttribute("title", 'Quantcast, Monthly Uniques: ' + quantcast);
		    popup.ws_quantcast.childNodes[1].setAttribute('href', 'http://quantcast.com/' + currUrl);
		    popup.ws_quantcast.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>Quantcast, Monthly Uniques: </span>" + quantcast);
		}
            }
	};
	qcxmlhttp.open("GET", workingURL, true);
	qcxmlhttp.send(null);
    });
}

function googlebl() {
    chrome.tabs.getSelected(null, function(tab) {
	var currUrl = getHost(tab.url);
        workingURL = 'http://www.google.com/search?filter=0&q=link:' + encodeURIComponent(currUrl);
        googleblxmlhttp = getXmlHttpObject();
        googleblxmlhttp.onreadystatechange = function () {
            if (googleblxmlhttp.readyState == 4 && googleblxmlhttp.status == 200) {
                var rt = googleblxmlhttp.responseText;
                var end = rt.indexOf('</b> linking to <b>' + encodeURIComponent(currUrl));
                var start = rt.lastIndexOf(' <b>', end - 1);
                var end_alt = rt.indexOf(' results<nobr>');
                var start_alt = rt.lastIndexOf(' ', end_alt - 1);
                if (start_alt < rt.lastIndexOf('>', end_alt - 1)) start_alt = rt.lastIndexOf('>', end_alt - 1);
                var c = 4;
                var googlebl = '';
                if (start == -1 || end == -1) {
                    if (start_alt == -1 || end_alt == -1) googlebl = '0';
                    else {
                        start = start_alt;
                        end = end_alt;
                        c = 1;
                    }
                }
                if (start != -1 && end != -1) {
                    if (isInt(rt.substr(start + c, end - start - c))) googlebl = rt.substr(start + c, end - start - c);
                    else googlebl = 'n/a';
                }
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
		    var popup = popups[0];
		    popup.ws_googlebl.setAttribute("title", 'Google Backlinks: ' + googlebl);
		    popup.ws_googlebl.childNodes[1].setAttribute('href', 'http://google.com/search?hl=en&filter=0&lr=&ie=UTF-8&q=link:' + currUrl + '&filter=0');
		    popup.ws_googlebl.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>Google Backlinks: </span>" + googlebl);
		}
            }
        };
        googleblxmlhttp.open("GET", workingURL, true);
        googleblxmlhttp.send(null);
    });
}

function bingbl() {
    chrome.tabs.getSelected(null, function(tab) {
	      var currUrl = getHost(tab.url);
        workingURL = 'http://www.bing.com/search?q=inbody:' + encodeURIComponent(currUrl) + '+-site:' + encodeURIComponent(currUrl);
        bingblxmlhttp = getXmlHttpObject();
        bingblxmlhttp.onreadystatechange = function () {
            if (bingblxmlhttp.readyState == 4 && bingblxmlhttp.status == 200) {
                var rt = bingblxmlhttp.responseText;
                var bingbl='';
				        var regexpResult1=rt.match(/<span class="sb_count" id="count">(.*) result(|s)<\/span>/i);
				        var regexpResult2=rt.match(/<span class="sb_count" id="count">(.*) of (.*) result(|s)<\/span>/i);
				        if(regexpResult1==null && regexpResult2==null)
					          bingbl='0';
				        else{
					          if(regexpResult2)
						            bingbl = regexpResult2[2];
					          else
						            bingbl = regexpResult1[1];
					          if(!isInt(bingbl))
						            bingbl='0';
				        }
		            var popups = chrome.extension.getViews({type: "popup"});
		            if (popups.length != 0) {
		                var popup = popups[0];
		                popup.ws_bingbl.setAttribute("title", 'Bing Backlinks: ' + bingbl);
		                popup.ws_bingbl.childNodes[1].setAttribute('href', 'http://bing.com/search?q=inbody:' + currUrl + '+-site:' + currUrl);
		                popup.ws_bingbl.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>Bing Backlinks: </span>" + bingbl);
		            }
            }
        };
        bingblxmlhttp.open("GET", workingURL, true);
        bingblxmlhttp.send(null);
    });
}

function linkedin() {
    chrome.tabs.getSelected(null, function(tab) {
	var currUrl = getHost(tab.url);
	var tld = currUrl.split('.')[1];
	var company = currUrl;
	if (tld in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''}) company = currUrl.split('.')[0];
        workingURL = 'http://linkedin.com/company/' + encodeURIComponent(company);
        linkedinxmlhttp = getXmlHttpObject();
        linkedinxmlhttp.onreadystatechange = function () {
            if (linkedinxmlhttp.readyState == 4 && linkedinxmlhttp.status == 200) {
                var rt = linkedinxmlhttp.responseText;
		var linkedin;
		if (rt.indexOf('<div class="alert error">') != -1) linkedin = 'n/a';
		else if (rt.indexOf('<p>Already a member?</p>') != -1) linkedin = 'n/a, need to log in to LinkedIn';
		else {
		    var start = rt.indexOf('<p class="how-connect">');
		    if (rt.indexOf('</a> <span>Employees on LinkedIn', start) == -1) linkedin = 'n/a';
		    else {
			var end = rt.indexOf('</a> <span>Employees on LinkedIn', start);
			var start = rt.lastIndexOf('>', end);
			linkedin = rt.substr(start + 1, end - start - 1) + ' employees';
		    }
		}
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
		    var popup = popups[0];
		    popup.ws_linkedin.setAttribute('title', 'LinkedIn: ' + linkedin);
		    if (currUrl.split('.')[1] in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''}) {
			popup.ws_linkedin.childNodes[1].setAttribute('href', "http://linkedin.com/company/" + currUrl.split('.')[0]);
			popup.ws_linkedin.childNodes[1].insertAdjacentHTML('beforeEnd', "<span class='ws-text'>LinkedIn: </span>" + linkedin);
		    }
		    else {
			popup.ws_linkedin.childNodes[1].setAttribute('href', "http://linkedin.com/company/" + currUrl);
			popup.ws_linkedin.childNodes[1].insertAdjacentHTML('beforeEnd', "<span class='ws-text'>LinkedIn: </span>" + linkedin);
		    }
		}
            }
	};
        linkedinxmlhttp.open("GET", workingURL, true);
        linkedinxmlhttp.send(null);
    });
}

function crunchbase() {
    chrome.tabs.getSelected(null, function(tab) {
	var currUrl = getHost(tab.url);
	var tld = currUrl.split('.')[1];
	var company;
	if (tld in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''}) company = currUrl.split('.')[0];
	else company = currUrl.split('.')[0] + '-' + currUrl.split('.')[1];
        workingURL = 'http://www.crunchbase.com/company/' + encodeURIComponent(company);
        crunchbasexmlhttp = getXmlHttpObject();
        crunchbasexmlhttp.onreadystatechange = function () {
            if (crunchbasexmlhttp.readyState == 4 && crunchbasexmlhttp.status == 200) {
                var rt = crunchbasexmlhttp.responseText;
		var founded; var funding; var round; var acquiredby; var price; var date; var crunchbase;
    		if (rt.indexOf('>Founded</td>') != -1) {
		    var start = rt.indexOf('>Founded</td>');
		    start = rt.indexOf('td_right">', start);
		    var end = rt.indexOf('</td', start);
		    founded = rt.substr(start + 10, end - start - 10);
		    if (founded.search(/^[0-9\/]+$/) == 0) founded = 'Founded: ' + founded;
		    else founded = '';
		}
		else founded = '';
		if (rt.indexOf('Acquired by</td>') != -1) {
		    var start = rt.indexOf('Acquired by</td>');
		    start = rt.indexOf('title="', start);
		    var end = rt.indexOf('">', start);
		    if (rt.substr(start + 7, end - start - 7)) acquiredby = 'Acquired by: ' + rt.substr(start + 7, end - start - 7);
		    else acquiredby = '';
		    if (rt.indexOf('Date</td>') != -1) {
			var start = rt.indexOf('Date</td>');
			start = rt.indexOf('"td_right">', start);
			var end = rt.indexOf('</', start);
			date = rt.substr(start + 11, end - start - 11);
			if (date.search(/^[0-9\/]+$/) == 0) date = '  -  ' + date; 
			else date = '';
		    }		    		   
		    else date = '';
		    if (rt.indexOf('Price</td>') != -1) {
			var start = rt.indexOf('Price</td>');
			start = rt.indexOf('"td_right">', start);
			var end = rt.indexOf('</', start);
			price = rt.substr(start + 11, end - start - 11);
			if (price.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0]) price = ' / Price: ' + price.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0];
			else price = '';
		    }   
		    else price = '';
		}
		else {acquiredby = ''; date = ''; price = ''}
		if (rt.indexOf('Public</td>') != -1) {
		    var start = rt.indexOf('Public</td>');
		    start = rt.indexOf('title="', start);
		    var end = rt.indexOf('">', start);
		    if (rt.substr(start + 7, end - start - 7)) ipo = 'Public: ' + rt.substr(start + 7, end - start - 7); 
		    else ipo = '';
		    if (rt.indexOf('Date</td>') != -1) {
			var start = rt.indexOf('Date</td>');
			start = rt.indexOf('"td_right">', start);
			var end = rt.indexOf('</', start);
			ipodate = rt.substr(start + 11, end - start - 11);
			if (ipodate.search(/^[0-9\/]+$/) == 0) ipodate = '  /  Date: ' + ipodate;
			else ipodate = '';
		    }
		    else ipodate = '';
		}
		else {ipo = ''; ipodate = ''}
		if (acquiredby || ipo) {
		    funding = '';
		    round = '';
		}
		else {
		    if (rt.indexOf('Funding') == -1) funding = '';	
		    else {
			var start = rt.indexOf('Funding');
			if (rt.indexOf('$', start) == -1) funding = '';
			else {
			    start = rt.indexOf('$', start);
			    var end = rt.indexOf('</', start);
			    funding = rt.substr(start, end - start);
			    if (funding.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0]) funding = 'Total Funding: ' + funding.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0];
			    else funding = '';
			}
		    }
		    if (rt.lastIndexOf('<td class="td_left2">') == -1) round = '';
		    else {
			var start = rt.lastIndexOf('<td class="td_left2">');
			var end = rt.indexOf(' <sup', start);
			round = rt.substr(start + 21, end - start - 21);
			if (round.match(/(^(Seed|Angel|Series|Grant|Debt|Unattributed|Venture Round))\s?[A-Z]?,\s((1[0-2]|0?[1-9])\/[0-9][0-9])$/)[0]) round = round.match(/(^(Seed|Angel|Series|Grant|Debt|Unattributed|Venture Round))\s?[A-Z]?,\s((1[0-2]|0?[1-9])\/[0-9][0-9])$/)[0];
			else round = '';
		    }
		}
		if (founded && (acquiredby || ipo || funding || round)) var comma = ', ';
		else comma = ' ';
		if (funding && round) var slash = '  /  ';
		else slash = ' ';
		crunchbase = founded + comma + acquiredby + date + price + ipo + ipodate + funding + slash + round;
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
		    var popup = popups[0];
		    popup.ws_crunchbase.setAttribute("title", 'CrunchBase: ' + crunchbase);
		    if (currUrl.split('.')[1] in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''}) {
			popup.ws_crunchbase.childNodes[1].setAttribute('href', 'http://crunchbase.com/company/' + currUrl.split('.')[0]);
			popup.ws_crunchbase.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>CrunchBase: </span>" + crunchbase);
		    }
		    else {
			popup.ws_crunchbase.childNodes[1].setAttribute('href', "http://crunchbase.com/company/" + currUrl.split('.')[0] + "-" + currUrl.split('.')[1]);
			popup.ws_crunchbase.childNodes[1].insertAdjacentHTML("beforeEnd", "<span class='ws-text'>CrunchBase: </span>" + crunchbase);
		    }
		}
            }
        };
        crunchbasexmlhttp.open("GET", workingURL, true);
        crunchbasexmlhttp.send(null);
    });
}