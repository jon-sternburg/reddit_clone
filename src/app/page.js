

import React, {Fragment } from "react";
import styles from './homepage_styles.module.css'
import Posts_Container from './components/Posts_Container.js'
import Post_Page from './components/Post_Page.js'
import Homepage_Container from './components/Homepage_Container.js'
import Top_Bar from './components/Top_Bar.js'
import { setCookie, getCookie } from 'cookies-next';
import axios from 'axios';
import get_auth from './utils/get_auth';
import fetch_data from './utils/fetch_data';
import { cookies } from 'next/headers'
var qs = require('qs');
//export const fetchCache = 'force-no-store';
//export const revalidate = 0;


async function get_data(fetch_url) {

const access_token =  getCookie('access_token')


if (access_token) {

return await fetch_data(fetch_url, access_token)

} else {

const token_ = await get_auth()
setCookie('access_token', token_);
return await fetch_data(fetch_url, token_)

}
}


export default async function App() {
const fetch_url = 'https://oauth.reddit.com?sr_detail=1'
const data_ = await get_data(fetch_url)

const posts = data_ && data_.data && data_.data.data && data_.data.data.children ? data_.data.data.children : null
const after =  data_ && data_.data && data_.data.data && data_.data.data.after ? data_.data.data.after : null


 return (
<Fragment>
{data_ && data_.data && (
<Homepage_Container 
data = {data_.data}
fetch_url = {fetch_url}
subreddit = {false}
user = {false}
token = {data_.token}
posts = {posts} 
after = {after}
/>
)}

</Fragment>


)}

