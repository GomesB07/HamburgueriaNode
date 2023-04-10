const cors = require('cors')
const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())
app.use(cors())
const port = 3001
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
    const {clientName, order, } = request.body
    const makeOrder = {id: uuid.v4(), order, clientName}
    orders.push(makeOrder)
    return response.status(201).json(makeOrder)
})

app.put('/order/:id', methodAndPath, checkOrderId, (request, response) => {
    const id = request.orderId
    const {clientName, order} = request.body
    const index = request.orderIndex
    const updatedOrder = {id, clientName, order}
    orders[index] = updatedOrder

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

app.listen(port, () => {
    console.log('Server rodando!')
})