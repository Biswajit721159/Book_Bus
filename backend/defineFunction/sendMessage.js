

const getMessage=async(req,resp)=>{
    let data=await dbconnect_sendMessage();
    let result=await data.find({}).toArray()
    return resp.send(result)
}

