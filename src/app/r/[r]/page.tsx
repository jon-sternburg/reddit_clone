import React, {Fragment } from "react";
import styles from '../../homepage_styles.module.css'
import Homepage_Container from '../../components/Homepage_Container'
import fetch_data from '../../utils/fetch_data';
import {Thread} from '../../types/post_types'
var qs = require('qs');


type Posts = Thread[] | null
type After = string | null


type PageProps = {
  params: { r: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}


export default async function App(props: PageProps) {
const subreddit = props.params.r
const fetch_url = `https://oauth.reddit.com/r/${subreddit}/?sr_detail=1`
const data_ = await fetch_data(fetch_url)


const posts:Posts = data_.data == null ? null : data_.data.data.children
const after:After = data_.data == null ? null : data_.data.data.after


 return (



<Fragment>
{data_ && data_.data && (
<Homepage_Container 
token = {data_.token}
fetch_url = {fetch_url}
posts = {posts} 
after = {after}
post_page = {false}
/>
)}
</Fragment>



)}


