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
import Table from "@mui/material/Table";
let arrTopFive=[]
//APIDEN GELEN DEĞERLER ÇEKİLİYOR
const palette = ['#045F5F','#3EA99F','#007C80','#BCE954','#808000','#64E986','#C2E5D3','#F67280','#3EB489','#555D50','steelblue','#254117','#FED8B1','#C34A2C','#FE632A','#F75D59'];
export const productList = await urunApi.getUrunler();
export const logList = await gunlukApi.getGunlukler();
export const catList = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);


let arrProduct =[]
let arrTopProduct=Array.from({ length: 5 }, () => new Array(3).fill(null));
for (let i = 0; i < 30; i++) {
    arrProduct[i] = [];
    for (let j = 0; j < catList.length; j++) {
        arrProduct[i][j] = 0;
    }
}
const zort=arrProduct
function createData(name, kategori, verimlilik) {
    return { name, kategori, verimlilik};
}


await filterTopFive()
console.log(arrTopProduct)
const rows = [
    createData(arrTopProduct[0][1], arrTopProduct[0][0], arrTopProduct[0][2]),
    createData(arrTopProduct[1][1], arrTopProduct[1][0], arrTopProduct[1][2]),
    createData(arrTopProduct[2][1], arrTopProduct[2][0], arrTopProduct[2][2]),
    createData(arrTopProduct[3][1], arrTopProduct[3][0], arrTopProduct[3][2]),
    createData(arrTopProduct[4][1], arrTopProduct[4][0], arrTopProduct[4][2]),
];
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

console.log()
function getTodayDate() {
    const today = new Date();
    // today.setDate(today.getDate() + 1); // Bugünün tarihine bir gün ekler
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return today.toLocaleDateString('tr-TR', options);
}
function convertDate(date){
    return new Date(date.split('.').reverse().join('-'))
}
async function filterTopFive()
{
    const todayLog = logList.filter(gunluk => gunluk.tarih === getTodayDate()&&gunluk.hedeflenen!==0&&(gunluk.stok!==0||gunluk.sevk!==0)&&gunluk.personel_sayisi!==0);
    console.log(todayLog)
    let i=0
    todayLog.map(async (rLog) => {
        let totalVal = 0;
    for(let x=0;x<productList.length;x++){
        if (productList[x].isim===rLog.urun_isim) {

            totalVal += rLog.ulasilan / rLog.hedeflenen;
        }
        let j=0
        arrTopProduct[i][j]=totalVal*100
        arrTopProduct[i][j+1]=rLog.urun_isim
        arrTopProduct[i][j+2]=rLog.urun.kategori.isim

    }


        i++

    });
    arrTopProduct.sort((a, b) => b[0] - a[0]);

    for(let i=0;i<5;i++){
        if(arrTopProduct[i][0]!==null)
        arrTopProduct[i][0]= Number(arrTopProduct[i][0].toFixed(2))
    }


    console.log((arrTopProduct[0][0]))



}

async function filterByCatDaily() {

    const todayLog = logList.filter(gunluk => gunluk.tarih === getTodayDate()&&gunluk.hedeflenen!==0&&(gunluk.stok!==0||gunluk.sevk!==0)&&gunluk.personel_sayisi!==0);

    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        for(let i=0;i<todayLog.length;i++){
            if (catList[j] === todayLog[i].urun.kategori.isim){
                count++
                totalVal += todayLog[i].ulasilan / todayLog[i].hedeflenen;
            }
        }

        DailyData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;


    }

}

async function filterByCatMonth()
{

    let todayValues=getTodayDate().split('.')
    const date1=new Date(`${todayValues[2]}-${todayValues[1]}`)
    date1.setHours(3,0)
    const date2=new Date(date1)
    date2.setMonth(date2.getMonth()+1)
    date2.setDate(date2.getDate()-1)
    date2.setHours(3,0)
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2)&&gunluk.hedeflenen!==0&&(gunluk.stok!==0||gunluk.sevk!==0)&&gunluk.personel_sayisi!==0)

    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        for(let i=0;i<rangeLog.length;i++){
            if (catList[j] === rangeLog[i].urun.kategori.isim) {
                count++
                totalVal += rangeLog[i].ulasilan / rangeLog[i].hedeflenen;
            }
        }

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
        const rangeLog = logList.filter(gunluk =>gunluk.tarih=== lastDay&&gunluk.hedeflenen!==0&&(gunluk.stok!==0||gunluk.sevk!==0)&&gunluk.personel_sayisi!==0);
        for (let j = 0; j < catList.length; j++) {
            let tempVal=0
            let count=0
            for(let i=0;i<rangeLog.length;i++){
                if (catList[j] === rangeLog[i].urun.kategori.isim) {
                    count++
                    tempVal += rangeLog[i].ulasilan / rangeLog[i].hedeflenen;
                }
            }

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
    date1.setDate(date1.getDate()-(datePerc))
    date1.setHours(3,0)

    const date2=new Date(date1)
    date2.setDate(date2.getDate()+6)
    date2.setHours(3,0)

    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2)&&gunluk.hedeflenen!==0&&(gunluk.stok!==0||gunluk.sevk!==0)&&gunluk.personel_sayisi!==0)
    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        for(let i=0;i<rangeLog.length;i++){
            if (catList[j] === rangeLog[i].urun.kategori.isim) {
                count++
                totalVal += rangeLog[i].ulasilan / rangeLog[i].hedeflenen;
            }
        }
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
export function TopFiveProduct(){
    return (
        <Table sx={{ '& thead th:nth-child(1)': { width: '50%' } }}>
            <thead>
            <tr>
                <th style={{width: '25%', textAlign: 'center'}}>Kategori</th>
                <th style={{width: '25%', textAlign: 'center'}}>Ürün</th>
                <th style={{width: '25%', textAlign: 'center'}}>Verimlilik</th>
            </tr>
            </thead>
            <tbody>
            {rows.map((row) => (
                <tr key={row.name}>
                    <td style={{textAlign: 'center'}}>{row.verimlilik}</td>
                    <td style={{textAlign: 'center'}}>{row.name}</td>
                    <td style={{textAlign: 'center'}}>{row.kategori}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}








