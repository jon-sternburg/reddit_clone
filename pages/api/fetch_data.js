






export default async function fetch_data(req,res) {


let token_ = 'bearer ' + req.body.token
let url_ = req.body.url
console.log('fetching data (api) ', url_)
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
res.send(data_)
})
.catch(err => console.log(err))
}