import React, {useEffect, useState} from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import { dataJS } from '../dataJS';
import Box from "@mui/material/Box";
import {BarChart} from "@mui/x-charts/BarChart";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

let totalCompletedProduct=[],totalGoalProduct=[]
let tempCompletedProduct=0,tempGoalProduct=0
var parsedData=dataJS;
const date=new Date()
var datePerc=date.getUTCDay()
if(date.getUTCDay()===0){
    datePerc=7
}
let range
function getCurrentURL ()
{


    return window.location.href
}


// Example
const url = getCurrentURL().toString()



console.log(url)
const productNameVar=url.split("/")



let productName=productNameVar[4]



export  function DailyProductAnalyze() {


    let anotherPD=0,totalProductDay=0


    //GÜNLÜK HESAPLAMA
    var ham=parsedData.filter(function(product){
        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        console.log(dateH.getUTCMonth())
        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return product.Product===productName&&productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCDate()===dateH.getUTCDate()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()
    })

    for(let i=0;i<ham.length;i++){
        totalProductDay+=ham[i].CompletedCount
        anotherPD+=ham[i].GoalCount
    }
    const data = [
        { id: 0, value: totalProductDay, label: 'Tamamlanan' },
        { id: 1, value: anotherPD, label: 'Hedef' },

    ];

    return (
        <>
            <div style={{width: '480px', height: '400px'}} className={"App"}>
                <div className={"PieChart"}>

                    <h1 className={"Font"} style={{paddingRight: '100px'}}>Günlük Verimlilik</h1>
                    <div style={{width: '101%', height: '100%'}}>
                        <PieChart
                            series={[
                                {
                                    data,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export function WeeklyProductAnalyze() {
let anotherPW=0
    let totalProductW=0
//HAFTALIK HESAPLAMA
    var hamW=parsedData.filter(function(product){
        const weekStart=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()-(datePerc-1))
        const weekFinal=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()+(7-datePerc),23,59,59)
        console.log("Hafta Başlangıcı:"+weekStart+"  Hafta Bitişi:"+weekFinal)

        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return  product.Product===productName&&(productDate<=weekFinal&&productDate>=weekStart)
    })
    for(let i=0;i<hamW.length;i++){
        totalProductW+=hamW[i].CompletedCount
        anotherPW+=hamW[i].GoalCount
    }
    const data = [
        { id: 0, value: totalProductW, label: 'Tamamlanan' },
        { id: 1, value: anotherPW, label: 'Hedef' },

    ];

    return (
        <>
            <div style={{width: '480px', height: '400px'}} className={"App"}>
                <div className={"PieChart"}>

                    <h1 className={"Font"} style={{paddingRight: '100px'}}>Haftalık Verimlilik</h1>
                    <div style={{width: '101%', height: '100%'}}>
                        <PieChart
                            series={[
                                {
                                    data,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export function MonthlyProductAnalyze() {
let anotherPM=0  , totalProductM=0
//AYLIK HESAPLAMA
    var hamM=parsedData.filter(function(product){
        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return product.Product===productName&&productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()
    })
    for(let i=0;i<hamM.length;i++){
        totalProductM+=hamM[i].CompletedCount
        anotherPM+=hamM[i].GoalCount
    }








    const data = [
        { id: 0, value: totalProductM, label: 'Tamamlanan' },
        { id: 1, value: anotherPM, label: 'Hedef' },

    ];

    return (
        <>
            <div style={{width: '480px', height: '400px'}} className={"App"}>
                <div className={"PieChart"}>

                    <h1 className={"Font"} style={{paddingRight: '100px'}}>Aylık Verimlilik</h1>
                    <div style={{width: '101%', height: '101%'} }>
                        <PieChart
                            series={[
                                {
                                    data,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export function BarAnimationDaily() {


    const [itemNb, setItemNb] = useState(5);
    const [skipAnimation, setSkipAnimation] = useState(false);

    const handleItemNbChange = (event, newValue) => {
        if (typeof newValue !== 'number') {
            return;
        }
        setItemNb(newValue);
    };
     range=itemNb
    for(let j=range;j>0;j--){

        const dateH=new Date()
        dateH.setDate(dateH.getDate()-j)
        tempCompletedProduct=0
        tempGoalProduct=0
        const filterProduct = parsedData.filter(function (product) {
            console.log("GÜN " + dateH.getUTCDate() + "AY:" + dateH.getUTCMonth())
            const productDate = new Date(product.Year, product.Month - 1, product.Day);
            return productDate.getUTCMonth() === dateH.getUTCMonth() && productDate.getUTCDate() === dateH.getUTCDate() && productDate.getUTCFullYear() === dateH.getUTCFullYear() && product.Product === productName
        });
        for(let i=0;i<filterProduct.length;i++){

            tempCompletedProduct=filterProduct[i].CompletedCount
            tempGoalProduct=filterProduct[i].GoalCount
        }

        tempGoalProduct/=filterProduct.length
        tempCompletedProduct/=filterProduct.length
        if(filterProduct.length!==0){
            totalCompletedProduct[j]=tempCompletedProduct
            totalGoalProduct[j]=tempGoalProduct
        }
        else{
            totalCompletedProduct[j]=Number(0)
            totalGoalProduct[j]=Number(0)
        }
    }


    const highlightScope = {
        highlighted: 'series',
        faded: 'global',
    };


    const series = [
        {
            label: 'Tamamlanan Ürün Miktarı',
            data: [
                totalCompletedProduct[range], totalCompletedProduct[range-1], totalCompletedProduct[range-2], totalCompletedProduct[range-3], totalCompletedProduct[range-4], totalCompletedProduct[range-5], totalCompletedProduct[range-6], totalCompletedProduct[range-7], totalCompletedProduct[range-8], totalCompletedProduct[range-9], totalCompletedProduct[range-10], totalCompletedProduct[range-11], totalCompletedProduct[range-12],
                totalCompletedProduct[range-13], totalCompletedProduct[range-14], totalCompletedProduct[range-15],totalCompletedProduct[range-16],totalCompletedProduct[range-17],totalCompletedProduct[range-18],totalCompletedProduct[range-19],totalCompletedProduct[range-20],totalCompletedProduct[range-21],totalCompletedProduct[range-22],totalCompletedProduct[range-23],totalCompletedProduct[range-24],totalCompletedProduct[range-25],totalCompletedProduct[range-26],totalCompletedProduct[range-27],totalCompletedProduct[range-28],totalCompletedProduct[range-29],
            ],
        },
        {
            label: 'Hedeflenen Ürün Miktarı',
            data: [
                totalGoalProduct[range], totalGoalProduct[range-1], totalGoalProduct[range-2], totalGoalProduct[range-3], totalGoalProduct[range-4], totalGoalProduct[range-5], totalGoalProduct[range-6], totalGoalProduct[range-7], totalGoalProduct[range-8], totalGoalProduct[range-9], totalGoalProduct[range-10], totalGoalProduct[range-11], totalGoalProduct[range-12],
                totalGoalProduct[range-13], totalGoalProduct[range-14], totalGoalProduct[range-15],totalGoalProduct[range-16],totalGoalProduct[range-17],totalGoalProduct[range-18],totalGoalProduct[range-19],totalGoalProduct[range-20],totalGoalProduct[range-21],totalGoalProduct[range-22],totalGoalProduct[range-23],totalGoalProduct[range-24],totalGoalProduct[range-25],totalGoalProduct[range-26],totalGoalProduct[range-27],totalGoalProduct[range-28],totalGoalProduct[range-29],
            ],
        },

    ].map((s) => ({ ...s, highlightScope }));


    return (
        <Box sx={{ width: '100%' }}>
            <BarChart
                height={300}
                series={series
                    .slice(0, 2)
                    .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
                skipAnimation={skipAnimation}
            />
            <FormControlLabel
                checked={skipAnimation}
                control={
                    <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
                }
                label="Animasyonları Kapat"
                labelPlacement="end"
            />
            <Typography id="input-item-number" gutterBottom>
                Günlerin Aralık Sayısı
            </Typography>
            <Slider
                value={itemNb}
                onChange={handleItemNbChange}
                valueLabelDisplay="auto"
                min={1}
                max={30}
                aria-labelledby="input-item-number"
            />

        </Box>
    );
}

