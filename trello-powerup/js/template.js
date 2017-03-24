var Promise = TrelloPowerUp.Promise;
// var WHITE_ICON = './images/icon-white.svg';
// var GRAY_ICON = './images/icon-gray.svg';
var cardEndpoint = 'https://ygrstg2qvi.execute-api.us-west-2.amazonaws.com/dev/card/';

function makeRequest (method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

function getCard(cardId) {
  return makeRequest('GET', cardEndpoint+cardId)
  .then(JSON.parse);
}

var getBadges = function(t) {
  return t.card('id').get('id').then(function(cardId) {
    console.log(cardId);
    return getCard(cardId).then(function(card) {
      var cardAutoDue = card.autoDueTimestamp * 1000;
      var daysLeft = Math.ceil( (cardAutoDue - Date.now())/(3600*24*1000) );
      var daysLeftText = ' days left';
      if (daysLeft == 1) {
        daysLeftText = ' day left';
      }
      return [{
        text: daysLeft + daysLeftText,
        color: 'red',
        refresh: 3600
      }];
    });
  });
};

TrelloPowerUp.initialize({
  'card-badges': function(t, options) {
    return getBadges(t);
  }
});
