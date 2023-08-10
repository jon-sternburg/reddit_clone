import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios';
var qs = require('qs');


export const fetchCache = 'force-no-store';
export const revalidate = 0;


export async function POST(request) {
const req = await request.json()
const fetch_url = req.fetch_url
const access_token =  cookies().get('access_token')

if (access_token) {

const data_ = await fetch_data(fetch_url, access_token)
return NextResponse.json({data: data_, token: token_})

} else {

const token_ = await get_auth()
cookies().set('access_token', token_)
console.log('TOKENasdfasdf_ ', token_)
const data_ = await fetch_data(fetch_url, token_)
return NextResponse.json({data: data_, token: token_})
}

}


async function fetch_data(url_, token) {


let token_ = 'bearer ' + token
return await fetch(url_, {
    method: 'GET',
    headers: {
      'Authorization': token_,
      'User-Agent': 'reddit_clone! by flickeringfreak',
      'content_type': "application/json"

    },
    mode:"no-cors",
  })
.then((res) => res.json())
.then((data_) => {
  return data_
}).catch(err => console.log(err))
}




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



async function get_auth() {


let data_ = await axios.post(
            'https://www.reddit.com/api/v1/access_token',
            qs.stringify({grant_type: 'client_credentials'}),
            { auth: { username: clientid, password: secret }})
return data_.data.access_token

}
