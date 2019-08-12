let middlewareObject = {};

middlewareObject.checkStatusError = function(req, res) {
    if (req.hasOwnProperty('status')) // contains a status prop if error
    {
        return res.status(req.status.status_code).json({
            message: req.status.message
        });
    }
    return;
}

module.exports = middlewareObject;