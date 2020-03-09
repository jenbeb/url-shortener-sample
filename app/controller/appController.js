const express = require("express");
const router = express.Router();
const Urls = require("../model/Urls");
const path = require('path');

router.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

/**
 * POST /shortenUrl
 * Shorten the given url
 */
router.post("/shortenUrl", (req, res, next) => {

    let url;

    // check if there's url passed
    if (isEmpty(req.body) || isEmpty(req.body.url)) {
        res.status(400)
          .json({ success: false, msg: "Data missing!", data: req.body });
        return;
    }

    if (!isValidUrl(req.body.url)) {
        res.json({ success: false, msg: "Not a valid url", data: req.body });
        return;
    }

    // Create a shorturl object
    url = new Urls({
        url: req.body.url,
    });

    saveShortUrl(url, res, req);

});


/**
 * GET /:id
 * get the url from url code
 */
router.get("/:id", (req, res, next) => {
    const urlCode = req.params.id;

    Urls.findOne({ urlCode: urlCode }, (err, urlObj) => {

        if (err) {
            console.log(err);
            res.status(500).json({ success: false, msg: "Internal Server Error!" });
            return;
        }

        if (isEmpty(urlObj)) {
            res.status(404).json({ success: false, msg: "Unknown Url" });
            return;
        }

        var redirectTo = urlObj.url;
        // Update the hits counter of url
        Urls.updateOne(
            { urlCode: urlCode },
            { $inc: { hits: 1 } },
            (err, model) => {
                if (err) {
                    console.log(err);
                    return;
                }

                if (redirectTo.indexOf('http://') === -1 && redirectTo.indexOf('https://') === -1) {
                    redirectTo = "http://" + redirectTo;
                }

                // Redirect to actual URL
                res.redirect(redirectTo);
            }
        );
    });
});


/**
 * save the shortened url
 * @params shortUrlObj
 * @params res
 */
function saveShortUrl(shortUrlObj, res, req) {
    // Generate a random string to replace the url
    let randomStr = generateRandomString();
    // Check if the random string already exist in DB
    Urls.findOne({ urlCode: randomStr }, (err, url) => {
        if (err) {
            console.log(err);
        } else if (url == null || isEmpty(url)) {
            console.log("url obj", url, randomStr);
            shortUrlObj.urlCode = randomStr;
            // no duplicates, save
            shortUrlObj.save(err => {
                if (err) {
                    res.status(400).json({ success: true, msg: err });
                }
                res.status(200).json({ success: true, url: "http://" + req.headers.host + "/" + randomStr });
            });
        } else {
            // Generated random string already exist in the DB
            // Try once again
            saveShortUrl(shortUrlObj, res, req);
        }
    });
}

/**
 * generate random string to use for the url replacement
 */
function generateRandomString() {
    var length = 6,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


/**
 * check if object is empty
 */
function isEmpty(obj) {
    if (obj == null) return true;
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}

function isValidUrl(str){
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}


module.exports = router;