(function (document, articles) {

    var $ = require('jquery.min');
    var _ = require('lodash.min');

    require('d3.min');
    require('topojson');
    require('datamaps.all.min');

    var map;

    var articlesByCountry = {};

    function init () {

        console.log('conflicting reports');

        console.log(articles);

        var $container = $('#Map');

        map = new Datamap({
            element : $container[0],
            responsive : true,
            projection: 'mercator',
            geographyConfig : {
                borderColor: 'Green',
                highlightFillColor : 'Green',
                highlightBorderWidth : 1,
                popupOnHover: false
            },
            fills : {
                defaultFill : 'black'
            },
            done: function(datamap) {

                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {

                    console.log(geography);

                    $('#Stories').removeClass('active');

                    setTimeout(function () {

                        var articles = articlesByCountry[geography.id];

                        if (articles && articles.length > 0) {

                            $('#Stories').addClass('active');

                            document.getElementById('Articles').innerHTML = '';

                            articles.forEach(function (article) {

                                document.getElementById('Country').innerHTML = geography.properties.name;

                                document.getElementById('Articles').innerHTML += '<li><a href="' + article.url + '">' + article.headline + '</a></li>';
                            });
                        }

                    }, 600);

                });
            }
        });

        updateMap(articles);

        bindEvents();
    }

    function bindEvents () {

        $(window).on('resize', function () {
            map.resize();
        });

        $('.source-check').on('change', function () {

            var filteredArticles = [];

            var sources = $('.source-check:checked');

            _.each(articles, function (article) {

                _.each(sources, function (source) {

                    if (source.value === article.source) {

                        filteredArticles.push(article);
                    }

                });
            });

            updateMap(filteredArticles);
        });
    }

    function updateMap (articles) {

        console.log('updateMap()');

        console.log(map);

        console.log(articles.length);

        var countries = {};

        articles.forEach(function (article) {

            article.countries.forEach(function (country) {
                if (country.code) {
                    articlesByCountry[country.code] = articlesByCountry[country.code] || [];
                    articlesByCountry[country.code].push({
                        url : article.url,
                        headline : article.headline,
                        story : article.story
                    });
                    countries[country.code] = countries[country.code] ? countries[country.code] + 0.15 : 0.15;
                }
            });
        });

        Object.keys(countries).forEach(function(country, index) {

            var frequency = countries[country];

            var color = 'rgba(255, 0, 0, ' + frequency + ')';

            countries[country] = color;
        });

        console.log(countries);

        console.log(articlesByCountry);

        map.updateChoropleth(countries);
    }

  init();

})(document, articles);
