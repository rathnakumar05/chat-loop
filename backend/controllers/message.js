var Messages = require('../models/messages');

var get = function (req, res, next) {
    var user_id = req.session._id;
    var p1 = req.body.p1; //to
    var p2 = req.body.p2; //from

    Messages.find({ from: { $in: [p1, p2] } , to: { $in: [p1, p2] }}, async function (err, messages) {
        if (err) {
            console.log(err);
        }
        var data = [];
        if (messages) {
            messages.forEach(function (el) {
                data.push({
                    message: el.message,
                    from: el.from,
                    to: el.to,
                    created_at: el.createdAt
                });
            });
        }

        await Messages.updateMany({ from: p2, to: p1, seen: "N" }, { seen: "Y" });

        return res.json(
            {
                type: "success",
                data: data
            }
        );
    });
}

module.exports = {
    get
}