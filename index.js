const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())
const port = 3000


const preparation = 'In preparation'
const ready = 'Ready'
const orders = []


const methodAndPath = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`)

    next()
}

const checkOrderId = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(order => order.id === id)
    if(index < 0){
        return response.status(404).json({error: 'Order not found'})
    }

    request.orderId = id
    request.orderIndex = index
    next()
}


app.get('/orders', methodAndPath, (request, response) => {
    return response.json(orders)
})

app.post('/order', methodAndPath, (request, response) => {
    const {clientName, order, price} = request.body
    const makeOrder = {id: uuid.v4(), clientName, order, price, status: preparation}
    orders.push(makeOrder)
    return response.status(201).json(makeOrder)
})

app.put('/order/:id', methodAndPath, checkOrderId, (request, response) => {
    const id = request.orderId
    const {clientName, order, price} = request.body
    const index = request.orderIndex
    const udpatedOrder = {id, clientName, order, price, status: preparation}
    orders[index] = udpatedOrder

    return response.status(200).json(udpatedOrder)
})

app.delete('/order/:id', methodAndPath, checkOrderId, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(204).json({message: 'Deleted order'})
})

app.get('/order/:id', methodAndPath, checkOrderId, (request, response) => {
    const index = request.orderIndex
    return response.json(orders[index])
})

app.patch('/order/:id', methodAndPath, checkOrderId, (request, response) => {
    const index = request.orderIndex
    orders[index].status = ready
    return response.json(orders[index])
})


app.listen(port, () => {
    console.log('Server rodando!')
})