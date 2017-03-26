
var cardEndpoint = 'https://ygrstg2qvi.execute-api.us-west-2.amazonaws.com/dev/card/';

function getCard(cardId) {
  return makeRequest('GET', cardEndpoint+cardId)
  .then(JSON.parse);
}

var getBadges = function(t) {
  return t.card('id').get('id').then(function(cardId) {
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
    }).catch(function(error) {
      console.log("Error on card with id: "+cardId);
      console.error(error);
    });
  });
};

TrelloPowerUp.initialize({
  'card-badges': function(t, options) {
    return getBadges(t);
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t);
  },
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184
    });
  }
});
