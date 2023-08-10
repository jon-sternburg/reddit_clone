

export default async function fetch_data(url_, token) {

console.log('fetching ', url_)
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
  return {data: data_, token: token}
}).catch(err => console.log(err))
}