$(document).ready(function () {

  var currentText = "";

  // Detect changes to the textbox area, sending the contents to monkeylearn
  // only if a new word has been added.
  window.setInterval(function () {

    if ($('#demo-text').val() != currentText) {
      console.log('Calling MonkeyLearn.');

      newText = $('#demo-text').val();

      // A new word has been added to the text area, send the contents to
      // MonkeyLearn.

      ML.extractKeywords(newText).done(function (data, textStatus, jqXHR) {

        $('.loading-circle').css("visibility", "hidden");
        $('#response-keywords').html(prettyPrint(data));

        if (jqXHR.status == 200) {
          // Clear the output first.
          $('#demo-keywords').empty();
          $('#demo-tagcloud').empty();

          var wordData = [];
          for (var i = 0; i < data.result[0].length; i++) {
            var kwNode = $('<div class="keyword-node"></div>');
            kwNode.text(data.result[0][i].keyword);
            $('#demo-keywords').append(kwNode);

            wordData.push({
              text: data.result[0][i].keyword,
              size: 30 + 100*(Math.max(data.result[0][i].relevance - 0.5, -0.2)),
            });
          }

          // Create the wordcloud.
          createWordcloud(wordData);

        }
      }).fail(function () {
        $('.loading-circle').css("visibility", "visible");
      });

      ML.extractEntities(newText).done(function (data, textStatus, jqXHR) {

        $('.loading-circle').css("visibility", "hidden");
        $('#response-entities').html(prettyPrint(data));

        if (jqXHR.status == 200) {
          // Clear the output first.
          $('#demo-entities > .list-group').empty();

          for (var i = 0; i < data.result[0].length; i++) {
            var entityNode = $('<li class="list-group-item entity-node"></div>');

            entityNode.text(data.result[0][i].entity);

            var labelNode;
            if (data.result[0][i].tag === 'PERS') {
              labelNode = $('<span class="label label-success">Person</span>');
            } else if (data.result[0][i].tag === 'LUG') {
              labelNode = $('<span class="label label-warning">Location</span>');
            } else if (data.result[0][i].tag === 'ORG') {
              labelNode = $('<span class="label label-primary">Organization</span>');
            } else if (data.result[0][i].tag === 'OTROS') {
              labelNode = $('<span class="label label-danger">Other</span>');
            }

            entityNode.prepend(labelNode);

            $('#demo-entities > .list-group').append(entityNode);
          }

        }
      }).fail(function () {
        $('.loading-circle').css("visibility", "visible");
      });

      ML.classify(newText).done(function (data, textStatus, jqXHR) {

        $('.loading-circle').css("visibility", "hidden");
        $('#response-sentiment').html(prettyPrint(data));

        if (jqXHR.status == 200) {
          // Clear the output first.
          $('#demo-sentiment').empty();

          for (var i = 0; i < data.result[0].length; i++) {
            var categoryNode = null;
            if (data.result[0][i].label === 'Good') {
              categoryNode = $('<div class="btn btn-success"></div>');
            } else if (data.result[0][i].label === 'Bad') {
              categoryNode = $('<div class="btn btn-danger"></div>');
            } else {
              categoryNode = $('<div class="category-node btn btn-default"></div>');
            }
            categoryNode.text(data.result[0][i].label);
            $('#demo-sentiment').append(categoryNode);
          }

        }
      }).fail(function () {
        $('.loading-circle').css("visibility", "visible");
      });

      ML.detectLanguage(newText).done(function (data, textStatus, jqXHR) {

        $('.loading-circle').css("visibility", "hidden");
        $('#response-language').html(prettyPrint(data));

        if (jqXHR.status == 200) {
          // Clear the output first.
          $('#demo-language').empty();

          for (var i = 0; i < data.result[0].length; i++) {
            var categoryNode = $('<div class="category-node btn btn-default"></div>');
            categoryNode.text(data.result[0][i].label);
            $('#demo-language').append(categoryNode);
          }

        }
      }).fail(function () {
        $('.loading-circle').css("visibility", "visible");
      });

      // Update the current text.
      currentText = newText;
    }
  }, 2300);

});


var createWordcloud = function (wordData) {
  var fill = d3.scale.category20b();

  function draw(words) {
    d3.select("#demo-tagcloud").append("svg")
      .attr("width", 740)
      .attr("height", 300)
      .append("g")
      .attr("transform", "translate(370,160)")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function (d) { return d.size + "px"; })
      .style("font-family", "impact")
      .style("fill", function (d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) { return d.text; });
  }

  d3.layout.cloud().size([740, 300])
    .timeInterval(10)
    .words(wordData)
    .padding(1)
    .rotate(function () { return 0; })
    .font('impact')
    .fontSize(function (d) { return d.size; })
    .on("end", draw)
    .start();
}


var prettyPrint = function (obj) {
  var json = JSON.stringify(obj, undefined, 2);
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
