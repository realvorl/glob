var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    barometer: function (req, res) {
        var year = req.query.year;
        var month = req.query.month;
        preparation(req, res, ("_nzbarometer/" + year + month + "_n_barometer.html"));
    },

    newRegistrations: function (req, res) {
        preparation(req, res, "_n_top3.html");
    },

    top50: function (req, res) {
        preparation(req, res, "_n_top50.html");
    }
}

function preparation(req, res, endpoint) {

    var section = req.query.section;
    var year = req.query.year;
    var month = req.query.month;

    prepare(endpoint, year, month, section)
        .then(function (fulfilled) {
            res.send(fulfilled);
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send('Something broke!');
        })
}

function prepare(endpoint, year, month, section) {
    var url = "https://www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/" + year + "/" + year + month + "_GV1monatlich/" + year + month + endpoint;
    var cars = [];
    var returnable = new Promise(
        function (resolve, reject) {
            request(url, function (error, response, html) {
                if (!error) {
                    var $ = cheerio.load(html);
                    const table1 = $('div#section' + section);
                    var _THs = [];
                    var _TDs = [];
                    var _TDp = [];
                    var dataSet = null;
                    table1.find($('tr')).each(function (i, elem) {
                        if (!dataSet) dataSet = $(this).find('th.head').eq(0).text();
                        _THs.push($(this).find('th.stub').eq(0).text());
                        _TDs.push($(this).find('td.data').eq(0).text().replace(".", ""));
                        _TDp.push($(this).find('td.data').eq(1).text().replace(",", "."));
                    });
                    for (var idx = 0; idx < _THs.length; idx++) {
                        var aSample = {
                            'meta': _THs[idx],
                            'nominalCount': parseInt(_TDs[idx]),
                            'percentChange': parseFloat(_TDp[idx])
                        };
                        if (aSample.nominalCount) cars.push(aSample);
                    }
                    var meld = { 'tag': dataSet, 'section': section, 'registrations': cars };
                    resolve(meld);
                }
            });
        });
    return returnable;
};
