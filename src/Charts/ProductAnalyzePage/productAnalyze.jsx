import React, {useEffect, useState} from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import Box from "@mui/material/Box";
import {BarChart} from "@mui/x-charts/BarChart";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import urunApi from "../../api/urun-api.js";
import gunlukApi from "../../api/gunluk-api.js";
import { logList,productList } from '../CategoryAnalyzePage/CategoryAnalyzeComponents.jsx';


const proList = productList.map((urun) => urun.isim);

let arrProduct = [];
for (let i = 0; i < 30; i++) {
    arrProduct[i] = [];
    for (let j = 0; j <2; j++) {
        arrProduct[i][j] = 0;
    }
}


let range
const date=new Date()
var datePerc=date.getUTCDay()
//BU KISIMDA DAY FONKSİYONUNU PAZARTESİ GÜNÜNDEN BAŞLAYACAK BİÇİMDE MODİFİYE ETTİM
if(date.getUTCDay()===0){
    datePerc=7
}

const proArr=arrProduct


function getCurrentURL ()
{


    return window.location.href
}

let proVal;

const url = getCurrentURL().toString()

const productNameVar=url.split("/")

//BU KISIMDA TÜRKÇE KARAKTERDEN YABANCI KARAKTERLERE DÖNÜŞTÜREREK KARŞILAŞTIRMAY YAPIP ATAMASINI YAPIYORUM

let productName=productNameVar[4] 

for(let i=0;i<proList.length;i++){
    proVal=proList[i].split(' ').join('').replaceAll('Ğ','g')
        .replaceAll('Ü','u')
        .replaceAll('Ş','s')
        .replaceAll('I','i')
        .replaceAll('İ','i')
        .replaceAll('Ö','o')
        .replaceAll('Ç','c')
        .replaceAll('ğ','g')
        .replaceAll('ü','u')
        .replaceAll('ş','s')
        .replaceAll('ı','i')
        .replaceAll('ö','o')
        .replaceAll('ç','c');
    if(proVal===productName){
        proVal=proList[i]
        break
    }
}

//Alttaki kısımda  datalar ve ataması yapıldı

const DailyData = [
    { id: 0, value: 0, label: 'Başarılı' },
    { id: 1, value: 0, label: 'Başarısız' },

];
await filterByCatDaily()

const monthData = [
    { id: 0, value: 0, label: 'Başarılı' },
    { id: 1, value: 0, label: 'Başarısız' },

];
await filterByCatMonth()

const weekData = [
    { id: 0, value: 0, label: 'Başarılı' },
    { id: 1, value: 0, label: 'Başarısız' },

];
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

    const todayLog = logList.filter(gunluk => gunluk.tarih === getTodayDate()&&gunluk.sevk!==0&&gunluk.stok!==0&&gunluk.personel_sayisi!==0);
    console.log(todayLog[0])
    let totalVal = 0;
    let count=0
    let i=0
    //Günlük veriler sonrası karşılaştırma
   todayLog.map(async (log) => {
        const productCategory = productList.filter(r=>r.isim===log.urun_isim);

       if (proVal=== productCategory[0].isim&&log.stok!==0&&log.sevk!==0&&log.personel_sayisi!==0) {
           console.log(log.stok)
           count++
           totalVal += log.ulasilan / log.hedeflenen;

       }

     i++
    });
    totalVal=(totalVal/count)*100;
    let fail=100-totalVal
    if(fail<0){
        fail=0
    }

    DailyData.find(predicate => predicate.label === "Başarılı").value = totalVal
    DailyData.find(predicate => predicate.label === "Başarısız").value = fail




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

    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2)&&gunluk.sevk!==0&&gunluk.stok!==0&&gunluk.personel_sayisi!==0)
    let totalVal = 0;
    let count=0
    //Aylık log verisi sonrası karşılaştırma
   rangeLog.map(async (MonthLog) => {
       const productCategory = productList.filter(r=>r.isim===MonthLog.urun_isim);

        if (proVal=== productCategory[0].isim) {
            count++
            totalVal += MonthLog.ulasilan / MonthLog.hedeflenen;
        }
    });
    totalVal=(totalVal/count)*100;
    let fail=100-totalVal
    if(fail<0){
        fail=0
    }
    monthData.find(predicate => predicate.label === "Başarılı").value = totalVal
    monthData.find(predicate => predicate.label === "Başarısız").value = fail


}
async function monthlyBarChart(){

    let todayValues=getTodayDate().split('.')
    const date1=new Date(`${todayValues[2]}-${todayValues[1]}-${todayValues[0]}`)
    const tempDate=new Date()
    for(let i=0;i<30;i++){
        date1.setDate(tempDate.getDate()-i)
        let lastDay=date1.toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        const rangeLog = logList.filter(gunluk =>gunluk.tarih=== lastDay&&gunluk.sevk!==0&&gunluk.stok!==0&&gunluk.personel_sayisi!==0);
        let tempVal=0
        let count=0
      rangeLog.map(async (barLog) => {
              const productCategory = productList.filter(r=>r.isim===barLog.urun_isim);

                    if (proVal === productCategory[0].isim) {
                        count++
                        tempVal += barLog.ulasilan / barLog.hedeflenen;
                    }

                }
                );
        //Mevcut değerler isimle uyuşuyorsa burada döngüden çıkan verileri eşitliyorum
        tempVal/=count
        tempVal*=100
        let tempFail=100-tempVal
        if(tempVal<0)
            tempVal=0
        arrProduct[i][0]=tempVal
        if(isNaN(arrProduct[i][0]))
            arrProduct[i][0]=0
        arrProduct[i][1]=100-tempVal


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
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2)&&gunluk.sevk!==0&&gunluk.stok!==0&&gunluk.personel_sayisi!==0)
    let totalVal = 0;
    let count=0
    //Haftanın içindeki verilere göre karşılaştırma yapılıyor
    rangeLog.map(async (WeekLog) => {
        const productCategory = productList.filter(r=>r.isim===WeekLog.urun_isim);
        if (proVal === productCategory[0].isim) {
            count++
            totalVal += WeekLog.ulasilan / WeekLog.hedeflenen;
        }
    });
    totalVal=(totalVal/count)*100;
    let fail=100-totalVal
    if(fail<0){
        fail=0
    }

    //Burada veriler labela göre sırayla yazdırılıyor
    weekData.find(predicate => predicate.label === "Başarılı").value = totalVal
    weekData.find(predicate => predicate.label === "Başarısız").value = fail


}

export  function  DailyProductAnalyze() {
    const data=DailyData
    return (
        <>
            <div style={{width: '100%', height: '100%'}}>
                <div>

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
export function WeeklyProductAnalyze() {


//HAFTALIK HESAPLAMA
    const data=weekData

    return (
        <>
            <div style={{width: '100%', height: '100%'}}>
                <div className={"PieChart"}>

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
export function MonthlyProductAnalyze() {


    const data=monthData
    return (
        <>
            <div style={{width: '100%', height: '100%'}} className={"App"}>
                <div className={"PieChart"}>

                    <h1 className={"Font"} style={{paddingRight: '100px'}}>Aylık Verimlilik</h1>
                    <div style={{width: '100%', height: '101%'} }>
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
export function BarAnimationProduct() {
//Aralıkların belirlendiği kısım
    const [seriesNb, setSeriesNb] =useState(1);
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


//Yukarıdan alınan veriler burada atanıyor
    const label = "Başarılı"
    const data = [];
    for (let dataIndex = range; dataIndex >0; dataIndex--) {

        data.push( Number(proArr[dataIndex-1][0]));

    }
    dynamicSeries.push({ label, data });
    const label2="Başarısız"
    for (let dataIndex = range; dataIndex >0; dataIndex--) {

        data.push( Number(proArr[dataIndex-1][1]));

    }
    dynamicSeries.push({ label2, data });



    const highlightScope = {
        highlighted: 'series',
        faded: 'global',
    };


    const series = dynamicSeries.map((s) => ({ ...s, highlightScope }));

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
            </div>

        </Box>
    );
}