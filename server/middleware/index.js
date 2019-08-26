let middlewareObject = {};

// checks if a status message is present in the json
// indicating an error (no data returned)
middlewareObject.checkStatusError = function(req, res) {
    if (req.hasOwnProperty('status')) // contains a status prop if error
    {
        res.status(req.status.status_code).json({
            message: req.status.message
        });
        return true;
    }
    return false;
}

module.exports = middlewareObject;