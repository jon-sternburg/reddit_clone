import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Posts_Container from '../../components/Posts_Container.js'
import Post_Page from '../../components/Post_Page.js'
import Topbar from '../../components/Topbar.js'
import  { InferGetStaticPropsType, GetStaticProps } from 'next'
import { withRouter } from 'next/router'
import Head from 'next/head'
import { setCookie, getCookie } from 'cookies-next';
import get_auth from '../../utils/get_auth';
import fetch_data from '../../utils/fetch_data';
import styles from '../../homepage_styles.module.css'
var qs = require('qs');


export const getServerSideProps = async ({query, req, res, resolvedUrl}) => {

const access_token =  getCookie('access_token', { req, res })

let ref_ = req.headers && req.headers.referer ? req.headers.referer : null
let time_sort = query.sort == 'top' ? `&t=${query.t}` : ''
const url_ = query.post && ((!ref_) || (ref_.includes(resolvedUrl))) ? `https://oauth.reddit.com/api/info/?id=${query.post}`
                                                        : query.sort ? `https://oauth.reddit.com/r/${query.r}/${query.sort}/.json?sr_detail=1&sort=${query.sort}${time_sort}` : 
                                                                       `https://oauth.reddit.com/r/${query.r}/?sr_detail=1`

console.log(url_)
const key_ = query.post && ((!ref_) || (ref_.includes(resolvedUrl)))  ? 'post=' + query.post : query.r


if (access_token) {

let data = await fetch_data(url_, access_token)

return { props: { data: data, key: key_, fetch_url: url_, referer: ref_, resolvedUrl: resolvedUrl} }

} else {

let token_ = await get_auth()
setCookie('access_token', token_, { req, res, maxAge: 60 * 6 * 24 });
let data = await fetch_data(url_, token_)
return { props: { data: data, key: key_, fetch_url: url_, referer: ref_, resolvedUrl: resolvedUrl} }
}
}


const App = (props) => {

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
<title>Reddit Clone! - {props.router.query.r}</title>
<link rel="icon" href="/favicon.ico" />

</Head>


<div className = {styles.homepage_frame}>
<Topbar />

{props.router.query.post && props.router.asPath == props.resolvedUrl ?

<Post_Page 
data = {props.data} 
width = {size.width} 
height = {size.height} 
/>

:

<Posts_Container 
fetch_url = {props.fetch_url} 
query = {props.router.query.s} 
search = {false} 
width = {size.width} 
height = {size.height} 
subreddit = {props.router.query.r} 
posts = {props.data.data.children} 
after = {props.data.data.after}
/>

}
</div>
</Fragment>
)}
export default withRouter(App)



