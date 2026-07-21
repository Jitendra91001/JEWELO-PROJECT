import { Suspense } from "react"

const Card = () => {
    const url : string = "https://images.pexels.com/photos/19726016/pexels-photo-19726016/free-photo-of-an-aerial-view-of-a-winding-river-in-the-middle-of-a-green-field.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"

  return (
    <div>
        <Suspense>
        <h1>This is the card section</h1>
        <img src={url} alt="" />
        </Suspense>
    </div>
  )
}

export default Card