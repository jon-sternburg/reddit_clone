import axios from 'axios';
var qs = require('qs');

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



export default async function get_auth(req, res) {
console.log('getting auth')

let data_ = await axios.post(
            'https://www.reddit.com/api/v1/access_token',
            qs.stringify({grant_type: 'client_credentials'}),
            { auth: { username: clientid, password: secret }})

return data_.data.access_token

}