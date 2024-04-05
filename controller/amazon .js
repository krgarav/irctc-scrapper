const amazonData = require('../sites/amazon');
const irctcData = require('../sites/irctc');
const url = "https://www.amazon.in/";
const URL = "https://www.irctc.co.in/nget/train-search";
exports.getResult = async (req, res) => {
    try {
        const searchParam = req.header("search");

        const data = await amazonData(url, searchParam);
        return res.status(200).json({ message: "success", data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error occured" })
    }
}

exports.getIrctc = async (req, res) => {
    try {
        const userName = req.header("username");
        const password = req.header("password");
        const origin = req.header("origin");
        const destination = req.header("destination");
        console.log(userName, password)
        const data = await irctcData(URL, userName, password, origin, destination);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error occured" })
    }
}