const webAuth = require("./functions/UserAuth.js");
const db = require("../models");

exports.create = async ({body}, res) => {
    if (!webAuth.exists(body)) {
        return res.status(400).json({ success: false, error: "No body or null body received." }).end()
    }
    const Webinar = new db.Webinar(body);
    if (!webAuth.exists(Webinar)) {
        return res.status(400).json({
            success: false,
            error: 'You must provide all the required information for the form!'
        }).end()
    }
    if (await webAuth.existingWebinar(Webinar.title)) {
        return res.status(409).json({ success: false, error: "Title already exists as Webinar. Please choose a different title." }).end();
    } else {
        Webinar
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    id: Webinar._id,
                    message: 'Webinar created!',
                }).end()
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Webinar not created!',
                }).end()
            })
    }
}

exports.update = async (req,res) => {
    const {body} = req;
    if (!webAuth.exists(body)) {
        return res.status(400).json({ success: false, error: "No body or null body received." }).end()
    }
    const Webinar = new db.Webinar(body);
    if (!webAuth.exists(Webinar)) {
        return res.status(400).json({
            success: false,
            error: 'You must provide all the required information for the form!'
        }).end()
    }

    db.Webinar.findOne({ _id: req.params.id }, (err, webinar) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Webinar not found!',
            }).end()
        }
        if (body.title !== undefined) {
            webinar.title = body.title;
        }
        if (body.description !== undefined) {
            webinar.description = body.description;
        }
        if (body.date !== undefined) {
            webinar.date = body.date;
        }
        if (body.hosts !== undefined) {
            webinar.hosts = body.hosts;
        }
        if (body.mainTopic !== undefined) {
            webinar.mainTopic = body.mainTopic;
        }
        if (body.skillLevel !== undefined) {
            webinar.skillLevel = body.skillLevel;
        }
        if (body.quiz !== undefined) {
            webinar.quiz = body.quiz;
        }
        if (body.tags !== undefined) {
            webinar.tags = body.tags;
        }
        if (body.created_by !== undefined) {
            webinar.created_by = body.created_by;
        }
        webinar
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: webinar._id,
                    message: 'Webinar updated!',
                }).end()
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Webinar not updated!',
                }).end()
            })
    })
}

exports.delete = async (req,res) => {
    await db.Webinar.findOneAndDelete({ _id: req.params.id }, (err, webinar) => {
        if (err) {
            return res.status(400).json({ success: false, error: err }).end()
        }

        if (!webinar) {
            return res.status(404).json({ success: false, error: `Webinar not found` }).end()
        }

        return res.status(200).json({ success: true, message: "This Webinar was successfully deleted!", data: webinar }).end()
    }).catch(err => console.log(err))
}

exports.getId = async (req,res) => {
    await db.Webinar.findOne({ _id: req.params.id }, (err, webinar) => {
        if (err) {
            return res.status(400).json({ success: false, error: err }).end()
        }

        if (!webinar) {
            return res.status(404).json({ success: false, error: `Webinar not found` }).end()
        }
        return res.status(200).json({ success: true, data: webinar }).end()
    }).catch(err => console.log(err))
}

exports.getAll = async (req,res) => {
    await db.Webinar.find({}, (err, webinar) => {
        if (err) {
            return res.status(400).json({ success: false, error: err }).end()
        }
        if (!webinar.length) {
            return res.status(404).json({ success: false, error: `Webinars not found` }).end()
        }
        return res.status(200).json({ success: true, data: webinar }).end()
    }).catch(err => console.log(err))
}

exports.getCreatedBy = async (req, res) => {
    await db.Webinar.findOne({ _id: req.params.id })
        .populate("created_by")
        .then((webinarCreatedBy, err) => {
            if (err) {
                return res.status(400).json({ success: false, error: err }).end()
            }
            if (!webinarCreatedBy) {
                return res.status(404)
                    .json({ success: false, error: `Webinar's Creator not found!` }).end()
            }
            return res.status(200).json({ success: true, data: webinarCreatedBy }).end()
        }).catch(err => console.log(err))
}