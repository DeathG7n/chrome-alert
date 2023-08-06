
import { NextResponse } from "next/server"
const DerivAPIBasic = require('@deriv/deriv-api/dist/DerivAPIBasic');
const nodemailer = require('nodemailer');
const connection = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=36807');
import { ema } from "ta.js";

let trade = new Date()

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "christariccykid55@gmail.com",
      pass: 'jeulxhenulkttuum'
    }
});

const pause = ()=> {
    console.log("function paused")
    clearInterval(interval)
    setTimeout(() => {
        interval = setInterval(() => getTicksHistory(), 1000);
    }, 300000);
}

const api = new DerivAPIBasic({ connection });

const ticks_history_request = {
    ticks_history: 'R_75',
    count: 21,
    end: 'latest',
    style: 'candles',
    granularity: 300,
};




export async function GET(req){
    const getTicksHistory = async () => {
        const candles = await api.ticksHistory(ticks_history_request);
        const closePrices = candles?.candles?.map(i => {return i?.close - 35.495})
        const highPrices = candles?.candles?.map(i => {return i?.high - 35.4976})
        const lowPrices = candles?.candles?.map(i => {return i?.low - 35.5046})
        const openPrices = candles?.candles?.map(i => {return i?.open - 35.5046})
        const sma = ema(closePrices, closePrices.length)
        if(closePrices[19] > sma && openPrices[19] < sma ||  closePrices[19] < sma && openPrices[19] > sma){
            // Define the email content
            const mailOptions = {
                from: "christariccykid55@gmail.com",
                to: "meliodasdemonk8ng@gmail.com",
                subject: `Market Structure Broken at ${sma}`,
                text: 'Potential Buy Signal'
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent successfully:', info.response);
                }
            });
        }
        console.log(sma)
    };
    getTicksHistory()
    return NextResponse.json(trade)
}

 