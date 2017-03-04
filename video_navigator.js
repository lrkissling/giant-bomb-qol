var html = [
    '<a href="http://www.giantbomb.com/videos/blue-bombin-mega-man-4-part-01/2300-11878/">',
    'Wowee it\'s a link!</a>'
  ].join('');

var div = document.createElement('div');
div.setAttribute('class', 'tab-pane active');
div.setAttribute('style', 'height: 50px;')
div.innerHTML = html;

var parentElement = document.getElementsByClassName('tab-content')[0];
parentElement.insertBefore(div, parentElement.firstChild);
