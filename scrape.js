var config = require('./config'),
    q = require('q'),
    Channel = require('./models/channel'),
    Article = require('./models/article'),
    mongojs = require('mongojs');

var db = mongojs('creports');

function scrape () {

    // console.log('scrape.scrape()');

    var articles = db.collection('articles');

    var channels = config.channels;

    var channel;

    channels.forEach(function (data) {

        channel = new Channel(data.url, data.articleUrl, data.isXml);

        channel.scrape().then(function processScrape (urls) {

            urls.forEach(function (url) {

                articles.findOne({ url : url }, function(err, article) {

                    if (err) {

                        console.log(err);

                    } else if (!article) {

                        var article = new Article(url, data.article.headline, data.article.story, data.isConflictNews);

                        article.scrape()
                        .then(article.format.bind(article))
                        .then(article.analyse.bind(article))
                        .then(article.interpret.bind(article))
                        .then(function () {
                            console.log(article.url);
                            console.log(article.data.headline);
                            console.log(article.analysis.classifications);
                            console.log('WAR:', article.isConflict);

                            articles.insert(article);
                        });
                    } else {

                        console.log(url);
                        console.log('url already scraped');
                    }
                });

            });
        });
    });

}

module.exports = scrape;