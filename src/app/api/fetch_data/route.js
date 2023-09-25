import { NextResponse } from "next/server";

export async function POST(request) {
  const req = await request.json();
  const token_ = "bearer " + req.token;
  const url_ = req.url;
  return await fetch(url_, {
    method: "GET",
    headers: {
      Authorization: token_,
      "User-Agent": "reddit_clone! by flickeringfreak",
      content_type: "application/json",
    },
    mode: "no-cors",
  })
    .then((res) => res.json())
    .then((data_) => {
      return NextResponse.json(data_);
    })
    .catch((err) => console.log(err));
}
