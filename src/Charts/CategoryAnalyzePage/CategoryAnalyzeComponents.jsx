import React, {useEffect, useState} from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import urunApi from "../../api/urun-api.js";
import gunlukApi from "../../api/gunluk-api.js";
import kategoriApi from "../../api/kategori-api.js";

import Gunluk from "../../api/gunluk-api.js";

import {useLocation} from "react-router-dom";

//APIDEN GELEN DEĞERLER ÇEKİLİYOR
const palette = ['red','blue','yellow','orange','brown','green','grey','tomato','tan','steelblue','slateblue','powderblue','orchid','olive','magenta'];
export const productList = await urunApi.getUrunler();
export const logList = await gunlukApi.getGunlukler();
export const catList = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);

let arrProduct = [];
for (let i = 0; i < 30; i++) {
    arrProduct[i] = [];
    for (let j = 0; j < catList.length; j++) {
        arrProduct[i][j] = 0;
    }
}
const zort=arrProduct
console.log(arrProduct)

let range

const date=new Date()

var datePerc=date.getUTCDay()
//GÜN KISMININ TÜRKİYE LOCALİNE GÖRE MODİFİYE EDİLMESİ
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
const dynamicSeries = [];
await monthlyBarChart()


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

    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        todayLog.map(async (log) => {
            const productCategory = productList.filter(r=>r.isim===log.urun_isim);//await urunApi.getUrunByName(log.urun_isim);
            if (catList[j] === productCategory[0].kategori.isim) {
                count++
                totalVal += log.ulasilan / log.hedeflenen;
            }
        });

        DailyData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;


    }

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

    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))

    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        rangeLog.map(async (MonthLog) => {
            const productCategory = productList.filter(r=>r.isim===MonthLog.urun_isim);

            if (catList[j] === productCategory[0].kategori.isim) {
                count++
                totalVal += MonthLog.ulasilan / MonthLog.hedeflenen;
            }
        });

        monthData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;
    }

}
async function monthlyBarChart(){

    let todayValues=getTodayDate().split('.')
    const date1=new Date(`${todayValues[2]}-${todayValues[1]}-${todayValues[0]}`)
    const tempDate=new Date()
    for(let i=0;i<30;i++){
        date1.setDate(tempDate.getDate()-i)
        let lastDay=date1.toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        const rangeLog = logList.filter(gunluk =>gunluk.tarih=== lastDay);
        for (let j = 0; j < catList.length; j++) {
            let tempVal=0
            let count=0
            rangeLog.map(async (barLog) => {
                        const productCategory = productList.filter(r=>r.isim===barLog.urun_isim);

                        if (catList[j] === productCategory[0].kategori.isim) {
                            count++
                            tempVal += barLog.ulasilan / barLog.hedeflenen;
                        }

                    }
                )
            ;
            tempVal/=count
            tempVal*=100
            arrProduct[i][j]=tempVal
            if(isNaN(arrProduct[i][j]))
                arrProduct[i][j]=0

        }
    }
    return arrProduct
}
async function filterByCatWeek()
{

    let todayValues=getTodayDate().split('.')
    const date1=new Date(`${todayValues[2]}-${todayValues[1]}-${todayValues[0]}`)
    date1.setDate(date1.getDate()-(datePerc-1))
    const date2=new Date(date1)
    date2.setDate(date2.getDate()+6)
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))
    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        rangeLog.map(async (WeekLog) => {
            const productCategory = productList.filter(r=>r.isim===WeekLog.urun_isim);

            if (catList[j] === productCategory[0].kategori.isim) {
                count++
                totalVal += WeekLog.ulasilan / WeekLog.hedeflenen;
            }
        });

        weekData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;
    }

}
const refreshPage = () => {
    window.location.reload();

};
function refresh(){
    const location = useLocation();

    useEffect(() => {
        // Sadece belirli bir sayfada çalışmasını istiyorsanız
        if (location.pathname === '/belirli-sayfa') {
            // localStorage'da bir anahtar var mı kontrol et
            const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

            if (!hasVisitedBefore) {
                // Eğer daha önce ziyaret edilmemişse sayfa yenileme işlemi gerçekleştir
                window.location.reload();

                // localStorage'a ziyaret edildi bilgisini kaydet
                localStorage.setItem('hasVisitedBefore', 'true');
            }
        }
    }, [location.pathname]);
}
//refresh()

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
                            colors={palette}
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
                            colors={palette}
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
                            colors={palette}
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

    const [seriesNb, setSeriesNb] =useState(catList.length);
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


    for (let seriesIndex = 0; seriesIndex < seriesNb; seriesIndex++) {
        const label = catList[seriesIndex];
        const data = [];
        for (let dataIndex = range; dataIndex >0; dataIndex--) {

            data.push( Number(zort[dataIndex-1][seriesIndex]));

        }
        dynamicSeries.push({ label, data });
    }


    const highlightScope = {
        highlighted: 'series',
        faded: 'global',
    };


    const series = dynamicSeries.map((s) => ({ ...s, highlightScope }));

    return (
        <Box sx={{ width: '98%'}}>
            <BarChart
                colors={palette}
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
                    max={catList.length}
                    sx={{width:'30%'}}
                    aria-labelledby="input-series-number"
                    color='error'
                />
            </div>

        </Box>
    );
}








