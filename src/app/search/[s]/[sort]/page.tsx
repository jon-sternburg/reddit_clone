import React, {Fragment } from "react";
import Homepage_Container from '../../../components/Homepage_Container'
import fetch_data from '../../../utils/fetch_data';
import {Thread} from '../../../types/post_types'


type Posts = Thread[] | null
type After = string | null


type PageProps = {
  params: { sort: string; s: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}


export default async function App(props: PageProps) {
const query = props.params.s
const sort = props.params.sort

const sort_ = sort.includes('top') ? `top&t=${sort.replace('top_', '')}` : sort
const fetch_url = `https://oauth.reddit.com/search.json?q=${query}&nsfw=1&sr_detail=1&sort=${sort_.toLowerCase()}`

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


