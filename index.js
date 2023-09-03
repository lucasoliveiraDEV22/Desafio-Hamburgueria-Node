import cors from 'cors'
const port = 3001
const express = require ('express')
const app = express ()
app.use (express.json())
const uuid = require ('uuid')
app.use (cors())

/*
- Query Params => meusite.com/users?nome=rodolfo&age=28
-Route Params => /users/2  //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
-Request Body => { "name":"Rodolfo", "age":33}
- GET   => Buscar informação no Back-End
- POST => Criar informação no Back-End
- PUT / PATCH => Alterar/Atualizar Informação no Back-End
- DELETE => Deletar informação no Back-End

-MIDDLEWARE => Interceptador => Têm o poder de parar ou alterar dados da requisição
*/
const firstMiddleware = (request, response, next) =>{
    const { id } = request.params
    const index = newOrder.findIndex(costumer => costumer.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }
    request.orderIndex = index
    request.orderID = id
    next()
}

const secondMiddleWare = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)
    next()
}


const newOrder = []
app.post ('/order', secondMiddleWare, (request, response) => {
    try{
    const { order, clientName, price} = request.body
    if (price<40) throw new Error ("Only allowed prices over 40 dolars")
    //console.log (uuid)
    const costumer = {id: uuid.v4(), order, clientName, price, "status": "Em preparação"}
    newOrder.push (costumer)
    return response.status (201).json (costumer)
} catch(err) {
    return response.status (500).json ({error:err.message})
} finally {
    console.log ("Terminou tudo")
}

})

app.get ('/order', secondMiddleWare, (request, response) => {
    //console.log ('A rota foi chamada')
    return response.json(newOrder)
})

app.put ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    const id = request.orderID
    const { order, clientName, price} = request.body
    const updatedOrder = {id, order, clientName, price, "status": "Em preparação"}
    newOrder [index] = updatedOrder
    return response.json(updatedOrder)

})

app.delete ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    newOrder.splice (index,1)
    return response.status(204).json()
})

app.patch ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    const order = newOrder[index]
    order.status = "Pronto"
    return response.json(order)
})

app.get ('/order/:id', firstMiddleware, secondMiddleWare, (request, response) => {
    const index = request.orderIndex
    return response.send(newOrder [index])
})







app.listen (port, () =>  {
    console.log(`🚀 Server started on port ${port}`)
})