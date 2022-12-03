function auth(req, res, next) {
    if (req.session.auth === undefined || req.session.auth !== "Y") {
        return res.status(401).json({
            type: "error",
            message: "unauthorized",
        });
    } else {
        next();
    }
}

module.exports = {
    auth
}