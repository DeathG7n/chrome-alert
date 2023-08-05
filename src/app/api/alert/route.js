
import { NextResponse } from "next/server"
const DerivAPIBasic = require('@deriv/deriv-api/dist/DerivAPIBasic');
const connection = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=36807');
import { ema } from "ta.js";

let interval 
let trade = false

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

const getTicksHistory = async () => {
    const candles = await api.ticksHistory(ticks_history_request);
    const closePrices = candles?.candles?.map(i => {return i?.close - 35.495})
    const highPrices = candles?.candles?.map(i => {return i?.high - 35.4976})
    const lowPrices = candles?.candles?.map(i => {return i?.low - 35.5046})
    const openPrices = candles?.candles?.map(i => {return i?.open - 35.5046})
    const sma = ema(closePrices, closePrices.length)
    if(closePrices[19] > sma && openPrices[19] < sma ||  closePrices[19] < sma && openPrices[19] > sma){
        trade =  true
    } else {
        trade =  false
    }
    return trade
};


export async function GET(req){
    getTicksHistory()
    return NextResponse.json(trade)
}

 