import React, {useEffect, useState} from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import { dataJS } from '../dataJS';
import { BarChart } from '@mui/x-charts/BarChart';
import {Card} from "@mui/joy";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


let tempH=0,tempD=0,tempDrink=0
var goalCount=0
var completedCount=0
let totalHamL=[],totalDesertL=[],totalDrinkL=[];
let range
var parsedData=dataJS;
const date=new Date()

var datePerc=date.getUTCDay()
if(date.getUTCDay()===0){
    datePerc=7
}

export function CategoryDailyAnalyzeComp() {
let totalHam=0,totalDrink=0,totalDesert=0

    //GÜNLÜK HESAPLAMA

    var ham=parsedData.filter(function(product){

        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        console.log(dateH.getUTCMonth())
        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCDate()===dateH.getUTCDate()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()&&product.Category==="Hamur"
    })
    for(let i=0;i<ham.length;i++){
        totalHam+=(ham[i].CompletedCount/ham[i].GoalCount);
        goalCount+=ham[i].GoalCount
        completedCount+=ham[i].CompletedCount
    }
    console.log(ham.length)
    totalHam=(totalHam*100)/ham.length
    var icecek=parsedData.filter(function(product){
        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        const productDate = new Date(product.Year,product.Month-1,product.Day);

        return productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCDate()===dateH.getUTCDate()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()&&product.Category==="İçecek"
    })

    for(let i=0;i<icecek.length;i++){
        totalDrink+=(icecek[i].CompletedCount/icecek[i].GoalCount);
        goalCount+=icecek[i].GoalCount
        completedCount+=icecek[i].CompletedCount
    }
    totalDrink=(totalDrink*100)/icecek.length

    var tatli=parsedData.filter(function(product){
        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        const productDate = new Date(product.Year,product.Month-1,product.Day);
        console.log(productDate.getUTCMonth())
        return productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCDate()===dateH.getUTCDate()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()&& product.Category==="Tatlı"
    })
    for(let i=0;i<tatli.length;i++){
        totalDesert+=(tatli[i].CompletedCount/tatli[i].GoalCount);
        goalCount+=tatli[i].GoalCount
        completedCount+=tatli[i].CompletedCount
    }
    totalDesert=(totalDesert*100)/tatli.length



 const data = [
        { id: 0, value: totalHam, label: 'Hamur' },
        { id: 1, value: totalDesert, label: 'Tatlı' },
        { id: 2, value: totalDrink, label: 'İçecek' },
    ];

  return (
    <>
        <div style={{width: '100%', height: '100%'}} >
            <div >

                 <h1 className={"Font"} style={{paddingRight: '100px'}}>Günlük Verimlilik</h1>
                <div style={{width: '100%', height: '100%'}}>
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
export function CategoryWeeklyAnalyzeComp() {
    let totalHamW=0,totalDrinkW=0,totalDesertW=0

//HAFTALIK HESAPLAMA
    var hamW=parsedData.filter(function(product){
        const weekStart=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()-(datePerc-1))
        const weekFinal=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()+(7-datePerc),23,59,59)
        console.log("Hafta Başlangıcı:"+weekStart+"  Hafta Bitişi:"+weekFinal)

        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return  product.Category==="Hamur"&&(productDate<=weekFinal&&productDate>=weekStart)
    })
    console.log("HAMUR UZUNLUK:"+hamW.length)
    for(let i=0;i<hamW.length;i++){
        totalHamW+=(hamW[i].CompletedCount/hamW[i].GoalCount);


    }

    totalHamW=(totalHamW*100)/hamW.length

    var icecekW=parsedData.filter(function(product){
        const weekStart=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()-(datePerc-1))
        const weekFinal=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()+(7-datePerc),23,59,59)
        console.log("Hafta Başlangıcı:"+weekStart+"  Hafta Bitişi:"+weekFinal)

        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return  product.Category==="İçecek"&&(productDate<=weekFinal&&productDate>=weekStart)
    })

    for(let i=0;i<icecekW.length;i++){
        totalDrinkW+=(icecekW[i].CompletedCount/icecekW[i].GoalCount);
        console.log("Ürün Değerleri:"+icecekW[i].CompletedCount+"  ,"+icecekW[i].GoalCount)

    }
    console.log("içcecek sayısı:"+icecekW.length)
    totalDrinkW=(totalDrinkW*100)/icecekW.length

    var tatliW=parsedData.filter(function(product){
        const weekStart=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()-(datePerc-1))
        const weekFinal=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()+(7-datePerc),23,59,59)
        console.log("Hafta Başlangıcı:"+weekStart+"  Hafta Bitişi:"+weekFinal)

        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return  product.Category==="Tatlı"&&(productDate<=weekFinal&&productDate>=weekStart)
    })
    console.log("HAMUR UZUNLUK:"+tatliW.length)
    for(let i=0;i<tatliW.length;i++){
        totalDesertW+=(tatliW[i].CompletedCount/tatliW[i].GoalCount);

    }
    console.log("tatli sayısı:"+tatliW.length)
    totalDesertW=(totalDesertW*100)/tatliW.length



    const data = [
        { id: 0, value: totalHamW, label: 'Hamur' },
        { id: 1, value: totalDesertW, label: 'Tatlı' },
        { id: 2, value: totalDrinkW, label: 'İçecek' },
    ];

    return (
        <>
            <div style={{width: '100%', height: '100%'}}>
                <div >

                    <h1 className={"Font"} style={{paddingRight: '100px'}}>Haftalık Verimlilik</h1>
                    <div style={{width: '100%', height: '100%'}}>
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
export function CategoryMonthlyAnalyzeComp() {
let totalHamM=0,totalDrinkM=0,totalDesertM=0
//AYLIK HESAPLAMA
    var hamM=parsedData.filter(function(product){
        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return product.Category==="Hamur"&&productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()
    })
    for(let i=0;i<hamM.length;i++){
        totalHamM+=(hamM[i].CompletedCount/hamM[i].GoalCount);

    }
    totalHamM=(totalHamM*100)/hamM.length
    var icecekM=parsedData.filter(function(product){
        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return product.Category==="İçecek"&&productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()
    })

    for(let i=0;i<icecekM.length;i++){
        totalDrinkM+=(icecekM[i].CompletedCount/icecekM[i].GoalCount);

    }
    totalDrinkM=(totalDrinkM*100)/icecekM.length

    var tatliM=parsedData.filter(function(product){
        const dateH=new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
        const productDate = new Date(product.Year,product.Month-1,product.Day);
        return product.Category==="Tatlı"&&productDate.getUTCMonth()===dateH.getUTCMonth()&&productDate.getUTCFullYear()===dateH.getUTCFullYear()
    })
    for(let i=0;i<tatliM.length;i++){
        totalDesertM+=(tatliM[i].CompletedCount/tatliM[i].GoalCount);

    }
    totalDesertM=(totalDesertM*100)/tatliM.length

    const data = [
        { id: 0, value: totalHamM, label: 'Hamur' },
        { id: 1, value: totalDesertM, label: 'Tatlı' },
        { id: 2, value: totalDrinkM, label: 'İçecek' },
    ];

    return (
        <>
            <div style={{width: '100%', height: '100%'}} >
                <div>

                    <h1 className={"Font"} style={{paddingRight: '100px'}}>Aylık Verimlilik</h1>
                    <div style={{width: '100%', height: '100%'} }>
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

//SON 30 GÜN İÇİN AYARLANABİLİR BAR CHART
export function BarAnimation() {

    const [seriesNb, setSeriesNb] =useState(3);
    const [itemNb, setItemNb] = useState(30);
    const [skipAnimation, setSkipAnimation] = useState(false);
     range=itemNb


    const handleItemNbChange = (event, newValue) => {
        if (typeof newValue !== 'number') {
            return;
        }
        setItemNb(newValue);
    };
    const handleSeriesNbChange = (event, newValue) => {
        if (typeof newValue !== 'number') {
            return;
        }
        setSeriesNb(newValue);
    };
    console.log("RANGE DEĞERİ:::"+range)
    for(let j=range;j>0;j--){

        const dateH=new Date()
        dateH.setDate(dateH.getDate()-j)
        tempH=0
        const ham = parsedData.filter(function (product) {
            console.log("GÜN " + dateH.getUTCDate() + "AY:" + dateH.getUTCMonth())
            const productDate = new Date(product.Year, product.Month - 1, product.Day);
            return productDate.getUTCMonth() === dateH.getUTCMonth() && productDate.getUTCDate() === dateH.getUTCDate() && productDate.getUTCFullYear() === dateH.getUTCFullYear() && product.Category === "Hamur"
        });
        for(let i=0;i<ham.length;i++){

            tempH+=(ham[i].CompletedCount/ham[i].GoalCount);

        }
        console.log(ham.length)
        tempH=tempH /ham.length
        if(ham.length!==0){
            totalHamL[j]=tempH
        }
        else{
            totalHamL[j]=Number(0)
        }
        tempDrink=0

        const icecek = parsedData.filter(function (product) {

            //console.log("GÜN "+dateH.getUTCDate())
            const productDate = new Date(product.Year, product.Month - 1, product.Day);
            return productDate.getUTCMonth() === dateH.getUTCMonth() && productDate.getUTCDate() === dateH.getUTCDate() && productDate.getUTCFullYear() === dateH.getUTCFullYear() && product.Category === "İçecek"
        });

        for(let i=0;i<icecek.length;i++){
            tempDrink+=(icecek[i].CompletedCount/icecek[i].GoalCount);

        }
        tempDrink/=icecek.length
        if(icecek.length!==0){
            totalDrinkL[j]=tempDrink
        }
        else{
            totalDrinkL[j]=Number(0)
        }





        tempD=0
        const tatli = parsedData.filter(function (product) {
            const productDate = new Date(product.Year, product.Month - 1, product.Day);
            return productDate.getUTCMonth() === dateH.getUTCMonth() && productDate.getUTCDate() === dateH.getUTCDate() && productDate.getUTCFullYear() === dateH.getUTCFullYear() && product.Category === "Tatlı"
        });
        for(let i=0;i<tatli.length;i++){
            tempD+=(tatli[i].CompletedCount/tatli[i].GoalCount);

        }
        tempD/=tatli.length
        if(tatli.length!==0){
            totalDesertL[j]=tempD
        }
        else{
            totalDesertL[j]=Number(0)
        }


    }
    console.log("HAMUR DEĞER:"+totalHamL)
    console.log("Drink ARRRAY:"+ totalDrinkL)
    console.log("Desert ARRRAY:"+ totalDesertL)

    const highlightScope = {
        highlighted: 'series',
        faded: 'global',
    };


    const series = [
        {
            label: 'Hamur',
            data: [
                totalHamL[range], totalHamL[range-1], totalHamL[range-2], totalHamL[range-3], totalHamL[range-4], totalHamL[range-5], totalHamL[range-6], totalHamL[range-7], totalHamL[range-8], totalHamL[range-9], totalHamL[range-10], totalHamL[range-11], totalHamL[range-12],
                totalHamL[range-13], totalHamL[range-14], totalHamL[range-15],totalHamL[range-16],totalHamL[range-17],totalHamL[range-18],totalHamL[range-19],totalHamL[range-20],totalHamL[range-21],totalHamL[range-22],totalHamL[range-23],totalHamL[range-24],totalHamL[range-25],totalHamL[range-26],totalHamL[range-27],totalHamL[range-28],totalHamL[range-29],
            ],
        },
        {
            label: 'Tatlı',
            data: [
                totalDesertL[range], totalDesertL[range-1], totalDesertL[range-2], totalDesertL[range-3], totalDesertL[range-4], totalDesertL[range-5], totalDesertL[range-6], totalDesertL[range-7], totalDesertL[range-8], totalDesertL[range-9], totalDesertL[range-10], totalDesertL[range-11], totalDesertL[range-12],
                totalDesertL[range-13], totalDesertL[range-14], totalDesertL[range-15],totalDesertL[range-16],totalDesertL[range-17],totalDesertL[range-18],totalDesertL[range-19],totalDesertL[range-20],totalDesertL[range-21],totalDesertL[range-22],totalDesertL[range-23],totalDesertL[range-24],totalDesertL[range-25],totalDesertL[range-26],totalDesertL[range-27],totalDesertL[range-28],totalDesertL[range-29],
            ],
        },
        {
            label: 'İçecek',
            data: [
                totalDrinkL[range], totalDrinkL[range-1], totalDrinkL[range-2], totalDrinkL[range-3], totalDrinkL[range-4], totalDrinkL[range-5], totalDrinkL[range-6], totalDrinkL[range-7], totalDrinkL[range-8], totalDrinkL[range-9], totalDrinkL[range-10], totalDrinkL[range-11], totalDrinkL[range-12],
                totalDrinkL[range-13], totalDrinkL[range-14], totalDrinkL[range-15],totalDrinkL[range-16],totalDrinkL[range-17],totalDrinkL[range-18],totalDrinkL[range-19],totalDrinkL[range-20],totalDrinkL[range-21],totalDrinkL[range-22],totalDrinkL[range-23],totalDrinkL[range-24],totalDrinkL[range-25],totalDrinkL[range-26],totalDrinkL[range-27],totalDrinkL[range-28],totalDrinkL[range-29],
            ],
        },
        {
            label: 'series 4',
            data: [
                2361, 979, 2430, 1768, 1913, 2342, 1868, 1319, 1038, 2139, 1691, 935, 2262,
                1580, 692, 1559, 1344, 1442, 1593, 1889,
            ],
        },
        {
            label: 'series 5',
            data: [
                968, 1371, 1381, 1060, 1327, 934, 1779, 1361, 878, 1055, 1737, 2380, 875, 2408,
                1066, 1802, 1442, 1567, 1552, 1742,
            ],
        },
        {
            label: 'series 6',
            data: [
                2316, 1845, 2057, 1479, 1859, 1015, 1569, 1448, 1354, 1007, 799, 1748, 1454,
                1968, 1129, 1196, 2158, 540, 1482, 880,
            ],
        },
        {
            label: 'series 7',
            data: [
                2140, 2082, 708, 2032, 554, 1365, 2121, 1639, 2430, 2440, 814, 1328, 883, 1811,
                2322, 1743, 700, 2131, 1473, 957,
            ],
        },
        {
            label: 'series 8',
            data: [
                1074, 744, 2487, 823, 2252, 2317, 2139, 1818, 2256, 1769, 1123, 1461, 672,
                1335, 960, 1871, 2305, 1231, 2005, 908,
            ],
        },
        {
            label: 'series 9',
            data: [
                1792, 886, 2472, 1546, 2164, 2323, 2435, 1268, 2368, 2158, 2200, 1316, 552,
                1874, 1771, 1038, 1838, 2029, 1793, 1117,
            ],
        },
        {
            label: 'series 10',
            data: [
                1433, 1161, 1107, 1517, 1410, 1058, 676, 1280, 1936, 1774, 698, 1721, 1421,
                785, 1752, 800, 990, 1809, 1985, 665,
            ],
        },
    ].map((s) => ({ ...s, highlightScope }));


    console.log(totalHamL[1])

    return (
        <Box sx={{ width: '98%'}}>
            <BarChart
                height={300}
                series={series
                    .slice(0, seriesNb)
                    .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
                skipAnimation={skipAnimation}
            />
            <FormControlLabel
                checked={skipAnimation}
                control={
                    <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} color='error'/>
                }
                label="Animasyonları Kapat"
                labelPlacement="end"
            />
            <div className='sliders'>
                <Typography id="input-item-number" sx={{fontSize:16, backgroundColor:'rgb(235, 230, 230)'}} gutterBottom>
                Günlerin Aralık Sayısı
            </Typography>
            <Slider
                value={itemNb}
                onChange={handleItemNbChange}
                valueLabelDisplay="auto"
                min={1}
                max={30}
                sx={{width:'50%'}}
                aria-labelledby="input-item-number"
                color='error'
            />
            <Typography id="input-series-number" sx={{fontSize:16, backgroundColor:'rgb(235, 230, 230)'}} gutterBottom>
                Kategori Sayısı
            </Typography>
            <Slider
                value={seriesNb}
                onChange={handleSeriesNbChange}
                valueLabelDisplay="auto"
                min={1}
                max={10}
                sx={{width:'30%'}}
                aria-labelledby="input-series-number"
                color='error'
            />
            </div>
            
        </Box>
    );
}








