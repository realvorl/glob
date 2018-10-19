var request = require('request');
var cheerio = require('cheerio');


module.exports = {

    barometer: function (req, res) {

        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2018/201809_GV1monatlich/201809_nzbarometer/201809_n_barometer.html?nn=1859152
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2017/201712_GV1monatlich/201712_nzbarometer/201712_n_barometer.html
        // www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2016/201612GV1monatlich/201612_nzbarometer/201612_n_barometer.html?nn=1559514
        // www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2015/201505GV1monatlich/201505_nzbarometer/201505_n_barometer.html?nn=1155894
        // www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2015/201504GV1monatlich/201504_nzbarometer/201504_n_barometer_generische.html?nn=1148328
        // www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2014/201412GV1monatlich/201412_n_barometer_teil1_tabelle.html?nn=792204
        // www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2013/201312GV1monatlich/201312_n_barometer_teil1_tabelle.html?nn=791842   

        var year = req.query.year;
        var month = req.query.month;

        if (parseInt(year) < 2015) {
            preparation(req, res, ("_n_barometer_teil1_tabelle.html"));
        } else {
            if (parseInt(year) == 2015 && parseInt(month) < 5) return preparation(req, res, ("_nzbarometer/" + year + month + "_n_barometer_generische.html"));
            preparation(req, res, ("_nzbarometer/" + year + month + "_n_barometer.html"));
        }
    },

    newRegistrations: function (req, res) {
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2018/201809_GV1monatlich/201809_n_top3.html?nn=2075134
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2017/201712_GV1monatlich/201712_n_top3.html?nn=1841712
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2016/201612GV1monatlich/201612_n_top3.html?nn=1559514
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2015/201505GV1monatlich/201505_n_top3.html?nn=1155894
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2014/201412GV1monatlich/201412_n_top3_teil1_tabelle.html?nn=1124158
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2013/201312GV1monatlich/201312_n_top3_teil1_tabelle.html?nn=1859306
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2012/201212GV1monatlich/201212_n_top3_teil1_tabelle.html?nn=660582
        var year = req.query.year;

        if (parseInt(year) < 2015) {
            preparation(req, res, "_n_top3_teil1_tabelle.html");
        } else {
            preparation(req, res, "_n_top3.html");
        }
    },

    top50: function (req, res) {
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2015/201510GV1monatlich/201510_n_top50.html?nn=1187950
        //www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/2015/201504GV1monatlich/201504_n_top50_teil1_tabelle.html?nn=1148328
        var year = req.query.year;
        var month = req.query.month;

        if (parseInt(year) < 2015) {
            preparation(req, res, "_n_top50_teil1_tabelle.html");
        } else {
            if (parseInt(year) == 2015 && parseInt(month) < 5) return preparation(req, res, ("_n_top50_teil1_tabelle.html"));
            preparation(req, res, "_n_top50.html");
        }
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

function spitOutUrl(year, month, endpoint) {
    var midpart = (parseInt(year) < 2017 ? "GV1monatlich/" : "_GV1monatlich/");
    var url = "https://www.kba.de/DE/Statistik/Fahrzeuge/Neuzulassungen/MonatlicheNeuzulassungen/" + year + "/" + year + month + midpart + year + month + endpoint;
    console.log(url)
    return url;
}

function prepare(endpoint, year, month, section) {
    var url = spitOutUrl(year, month, endpoint);
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
