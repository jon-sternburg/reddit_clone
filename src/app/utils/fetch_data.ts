import {ThreadResult} from '../types/post_types'
import axios, {AxiosResponse} from 'axios';
import { cookies } from 'next/headers'
var qs = require('qs');


interface DataResponse{
  data: ThreadResult | null;
  token: string;
}

type CookieReponse = {
  name?: string;
  value?: string;
}

export default async function get_data(fetch_url:string) {

const access_token:(CookieReponse | undefined) = cookies().get('access_token')


if (access_token && access_token.value) {

return await fetch_data(fetch_url, access_token.value)

} else {

const token_:string = await get_auth()
return await fetch_data(fetch_url, token_)

}

}

async function fetch_data(url_:string, token:string): Promise<DataResponse>{


console.log('fetching ', url_)

let token_:string = 'bearer ' + token
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
  return {data: data_, token: token}
}).catch((err) => {

console.log(err)
return {data: null, token: token}

})
}




var clientid:string = process.env.CLIENT_ID!;
var secret:string = process.env.CLIENT_SECRET!;
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

type auth_ = {
  auth: {
    username: string;
    password: string;
  }
}

type Token = string
type AuthData = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}


type ApiResponse = {
  data: AuthData;
  status: number;
}

async function get_auth():Promise<Token>{


const auth_obj:auth_ = {auth: { username: clientid, password: secret }}

return axios.post<AxiosResponse, ApiResponse>('https://www.reddit.com/api/v1/access_token', qs.stringify({grant_type: 'client_credentials'}), auth_obj)
.then((response) => {
return response.data.access_token
})

.catch((err) => { console.log(err); return ''})









}