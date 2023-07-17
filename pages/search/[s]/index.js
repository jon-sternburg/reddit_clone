import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Posts_Container from '../../../components/Posts_Container.js'
import Topbar from '../../../components/Topbar.js'
import  { InferGetStaticPropsType, GetStaticProps } from 'next'
import { withRouter } from 'next/router'
import Head from 'next/head'
import { setCookie, getCookie } from 'cookies-next';
import axios from 'axios';
import styles from '../../../homepage_styles.module.css'
var qs = require('qs');

export const getServerSideProps = async ({query, req, res}) => {

const access_token =  getCookie('access_token', { req, res })
const url_ = `https://oauth.reddit.com/search.json?q=${query.s}&nsfw=1&sr_detail=1/?`
console.log(query.s)
if (access_token) {

let data = await fetch_data(access_token, url_)
return { props: { data: data, key: 'search_query=' + query.s, fetch_url: url_} }

} else {

let token_ = await get_auth()
setCookie('access_token', token_, { req, res, maxAge: 60 * 6 * 24 });
let data = await fetch_data(token_, url_)
return { props: { data: data, key: 'search_query=' + query.s, fetch_url: url_} }
}
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





async function get_auth(req, res) {
console.log('getting auth')

let data_ = await axios.post(
            'https://www.reddit.com/api/v1/access_token',
            qs.stringify({grant_type: 'client_credentials'}),
            { auth: { username: clientid, password: secret }})

return data_.data.access_token

}





async function fetch_data(token, url_) {


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

const App = (props) => {

console.log(props)
const [size, set_dim] = useState({width: 0, height: 0})


useEffect(() => {
window.addEventListener('resize', updateDimensions);
updateDimensions()
return () => window.removeEventListener('resize', updateDimensions);
}, [])

function updateDimensions() {
set_dim({width: window.innerWidth, height: window.innerHeight})
}







 return (
<Fragment>

<Head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reddit Clone!</title>
<link rel="icon" href="/favicon.ico" />

</Head>

<div className = {styles.homepage_frame}>
<Topbar 
subreddit = {props.router.query.r} 
query = {props.router.query.s} 
search = {props.search}
user = {props.router.query.u}
 />


<Posts_Container 
fetch_url = {props.fetch_url} 
query = {props.router.query.s} 
search = {true} 
width = {size.width} 
height = {size.height} 
subreddit = {props.router.query.r} 
posts = {props.data.data.children} 
after = {props.data.data.after}
/>

</div>
</Fragment>
)}
export default withRouter(App)

