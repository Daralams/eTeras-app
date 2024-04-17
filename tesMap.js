const posts = [
  {
    id: 1,
    title: "title 1",
    author: "john",
    likes: [
      {
        id: 1,
        postId: 1,
        author: "john",
        status: true
      },
      {
        id: 2,
        postId: 1,
        author: "vanda",
        status: true
      },
      {
        id: 3,
        postId: 1,
        author: "sakti",
        status: true
      },
      ]
  },
  {
    id: 2,
    title: "title 2",
    author: "vanda",
    likes: [
      {
        id: 4,
        postId: 2,
        author: "john",
        status: true
      },
      {
        id: 5,
        postId: 2,
        author: "vanda",
        status: false
      }
      ]
  },
  {
    id: 2,
    title: "title 3",
    author: "sakti",
    likes: [
      {
        id: 6,
        postId: 3,
        author: "mike",
        status: false
      },
      {
        id: 7,
        postId: 3,
        author: "vanda",
        status: false
      },
      {
        id: 8,
        postId: 3,
        author: "sakti",
        status: false
      }
      ]
  }
  ]
  const mapPosts = posts.map(post => {
    
    const ending = post.likes.filter(trueStatus => trueStatus.status == true)
    console.log(ending)
    console.log(ending.length)
    // const trueStatus = []
    // const result = trueStatus.push(likeData)
    // console.log(result)
  })
  
  const name = "vanda margraf"
  console.log(name[0])