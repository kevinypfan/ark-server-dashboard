const Gamedig = require("gamedig");

export default function handler(req, res) {
  const { host, type } = req.query;
  Gamedig.query({
    type,
    host,
  })
    .then((state) => {
      res.json(state);
    })
    .catch((error) => {
        res.json(null);
    });
}
