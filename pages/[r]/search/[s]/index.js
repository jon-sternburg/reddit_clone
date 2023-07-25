import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Posts_Container from '../../../../components/Posts_Container.js'
import Top_Bar from '../../../../components/Top_Bar.js'
import  { InferGetStaticPropsType, GetStaticProps } from 'next'
import { withRouter } from 'next/router'
import Head from 'next/head'
import { setCookie, getCookie } from 'cookies-next';
import get_auth from '../../../../utils/get_auth';
import fetch_data from '../../../../utils/fetch_data';
import styles from '../../../../homepage_styles.module.css'
var qs = require('qs');


export const getServerSideProps = async ({query, req, res}) => {

const access_token =  getCookie('access_token', { req, res })
const url_ = `https://oauth.reddit.com/r/${query.r}/search.json?q=${query.s}&restrict_sr=1&sr_detail=1/?`

if (access_token) {

let data = await fetch_data(url_, access_token)
return { props: { data: data, key: 'subreddit_search_query= ' + query.s, fetch_url: url_ } }

} else {

let token_ = await get_auth()
setCookie('access_token', token_, { req, res, maxAge: 60 * 6 * 24 });
let data = await fetch_data(url_, token_)
return { props: { data: data, key: 'subreddit_search_query= ' + query.s, fetch_url: url_} }
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
<title>Reddit Clone! - {props.router.query.r} search for {props.router.query.s}</title>
<link rel="icon" href="/favicon.ico" />

</Head>

<main className = {styles.homepage_frame}>
<Top_Bar />


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

</main>
</Fragment>
)}
export default withRouter(App)


