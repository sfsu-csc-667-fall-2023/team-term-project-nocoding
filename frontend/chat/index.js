import { io } from "socket.io";

const chatSocket = io();

chatSocket.on("chat:message:0", payload => {
    console.log({ payload })
})

document.querySelector("#message").addEventListener("keydown", event => {
    console.log(event)
})