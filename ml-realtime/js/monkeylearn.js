var MONKEYLEARN_TOKEN = 'YOUR API_KEY HERE';

var ML = {};

ML.extractKeywords = function (text) {
  // Sends the keyword extraction request to MonkeyLearn, returning the
  // promise object.
  var promise = $.ajax({
    url: 'https://api.monkeylearn.com/v2/extractors/ex_y7BPYzNG/extract/',
    type: 'POST',
    headers: {
      'Authorization': "token " + MONKEYLEARN_TOKEN,
    },
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      text_list: [text],
      max_keywords: 25
    })
  });

  return promise;
};


ML.extractEntities = function (text) {
  // Sends the entity extraction request to MonkeyLearn, returning the
  // promise object.
  var promise = $.ajax({
    url: 'https://api.monkeylearn.com/v2/extractors/ex_isnnZRbS/extract/',
    type: 'POST',
    headers: {
      'Authorization': "token " + MONKEYLEARN_TOKEN,
    },
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      text_list: [text]
    })
  });

  return promise;
};


ML.classify = function (text) {
  // Sends the classification request to MonkeyLearn, returning the promise
  // object.
  var promise = $.ajax({
    url: 'https://api.monkeylearn.com/v2/classifiers/cl_rZ2P7hbs/classify/?',
    type: 'POST',
    headers: {
      'Authorization': "token " + MONKEYLEARN_TOKEN,
    },
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      text_list: [text]
    })
  });

  return promise;
};


ML.detectLanguage = function (text) {
  // Sends the classification request to MonkeyLearn, returning the promise
  // object.
  var promise = $.ajax({
    url: 'https://api.monkeylearn.com/v2/classifiers/cl_hDDngsX8/classify/?',
    type: 'POST',
    headers: {
      'Authorization': "token " + MONKEYLEARN_TOKEN,
    },
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      text_list: [text]
    })
  });

  return promise;
};
