var request = require("request");

var clientid = process.env.CLIENT_ID;
var secret = process.env.CLIENT_SECRET;
var options = {
                url: "https://www.reddit.com/api/v1/access_token",
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    'User-Agent': 'reddit_clone'
                },
                auth: {
                    'username': clientid,
                    'password': secret
                },
                body: `grant_type=client_credentials`,
             };




export default async function handler(req, res) {

return new Promise((resolve,reject) => {
request(options, function(err, res, body) {
    var json = JSON.parse(body);
    var token = json['access_token'];
resolve(token)
});

}).then((token_) => {

res.json(token_)

}).catch(err => console.log(err))

}

