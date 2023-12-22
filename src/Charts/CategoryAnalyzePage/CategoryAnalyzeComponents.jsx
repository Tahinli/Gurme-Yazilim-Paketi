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
import urunApi from "../../api/urun-api.js";
import gunlukApi from "../../api/gunluk-api.js";
import kategoriApi from "../../api/kategori-api.js";
import {ca, da} from "date-fns/locale";
import Gunluk from "../../api/gunluk-api.js";

const productList = await urunApi.getUrunler();
const logList = await gunlukApi.getGunlukler();
// const urungir = (await urunApi.getUrunler()).map((urun) => urun.isim);
const catList = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);



//console.log(testData)

console.log(catList)
console.log(catList.length)
let tempH=0,tempD=0,tempDrink=0

let totalHamL=[],totalDesertL=[],totalDrinkL=[];
let range
var parsedData=dataJS;
const date=new Date()

var datePerc=date.getUTCDay()
if(date.getUTCDay()===0){
    datePerc=7
}

var DailyData = catList.map((label, index) => ({
    id: index,
    value: 0,
    label: label
}));
await filterByCatDaily()

var monthData = catList.map((label, index) => ({
    id: index,
    value: 0,
    label: label
}));
await filterByCatMonth()

var weekData = catList.map((label, index) => ({
    id: index,
    value: 0,
    label: label
}));
await filterByCatWeek()

function getTodayDate() {
    const today = new Date();
    // today.setDate(today.getDate() + 1); // Bugünün tarihine bir gün ekler
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return today.toLocaleDateString('tr-TR', options);
}
function convertDate(date){
    return new Date(date.split('.').reverse().join('-'))
}

async function filterByCatDaily() {
    const todayLog = logList.filter(gunluk => gunluk.tarih === getTodayDate());

    console.log(todayLog.length);

    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        await Promise.all(todayLog.map(async (log) => {
            const productCategory = await urunApi.getUrunByName(log.urun_isim);

            if (catList[j] === productCategory.kategori.isim) {
                count++
                console.log(log);
                console.log(productCategory);
                totalVal += log.ulasilan / log.hedeflenen;
                console.log(`totalVal: ` + totalVal);
            }
        }));

        DailyData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;
    }

    console.log(DailyData);
}
async function createData(){
    const [data,setData]=useState([])

}
async function filterByCatMonth()
{

    let todayValues=getTodayDate().split('.')
    const date1=new Date(`${todayValues[2]}-${todayValues[1]}`)
    const date2=new Date(date1)
    date2.setMonth(date2.getMonth()+1)
    date2.setDate(date2.getDate()-1)

    console.log("Tarih 1:"+date1+"Tarih 2 :"+date2)

    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))
    console.log(convertDate('23.12.2023')<convertDate('25.12.2023'))
    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        await Promise.all(rangeLog.map(async (MonthLog) => {
            const productCategory = await urunApi.getUrunByName(MonthLog.urun_isim);

            if (catList[j] === productCategory.kategori.isim) {
                count++
                console.log("AylıkLog:"+MonthLog);
                console.log(productCategory);
                totalVal += MonthLog.ulasilan / MonthLog.hedeflenen;
                console.log(`totalVal: ` + totalVal);
            }
        }));

        monthData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;
    }

}
async function filterByCatWeek()
{

    let todayValues=getTodayDate().split('.')
    const date1=new Date(`${todayValues[2]}-${todayValues[1]}-${todayValues[0]}`)
    date1.setDate(date1.getDate()-(datePerc-1))
    const date2=new Date(date1)
    date2.setDate(date2.getDate()+6)
    let d1=date1.toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    let d2 = date2.toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const firstRange=convertDate(d1)
    const lastRange=convertDate(d2)
    console.log("İlk Date Değer:"+date1+"2. Date Değer:"+date2)
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=firstRange&&convertDate(gunluk.tarih)<=lastRange))
    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        await Promise.all(rangeLog.map(async (WeekLog) => {
            const productCategory = await urunApi.getUrunByName(WeekLog.urun_isim);

            if (catList[j] === productCategory.kategori.isim) {
                count++
                console.log(WeekLog);
                console.log(productCategory);
                totalVal += WeekLog.ulasilan / WeekLog.hedeflenen;
                console.log(`totalVal: ` + totalVal);
            }
        }));

        weekData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;
    }

}
//GÜNLÜK HESAPLAMA
export  function  CategoryDailyAnalyzeComp() {
    const data=DailyData
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


//HAFTALIK HESAPLAMA
    const data=weekData

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
//AYLIK HESAPLAMA
export function CategoryMonthlyAnalyzeComp() {


    const data=monthData
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

    for(let j=range;j>0;j--){

        const dateH=new Date()
        dateH.setDate(dateH.getDate()-j)
        tempH=0
        const ham = parsedData.filter(function (product) {

            const productDate = new Date(product.Year, product.Month - 1, product.Day);
            return productDate.getUTCMonth() === dateH.getUTCMonth() && productDate.getUTCDate() === dateH.getUTCDate() && productDate.getUTCFullYear() === dateH.getUTCFullYear() && product.Category === "Hamur"
        });
        for(let i=0;i<ham.length;i++){

            tempH+=(ham[i].CompletedCount/ham[i].GoalCount);

        }

        tempH=tempH /ham.length
        if(ham.length!==0){
            totalHamL[j]=tempH
        }
        else{
            totalHamL[j]=Number(0)
        }
        tempDrink=0

        const icecek = parsedData.filter(function (product) {


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








