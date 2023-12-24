import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { PieChart } from '@mui/x-charts/PieChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useEffect, useState} from "react";
import {Button, responsiveFontSizes} from "@mui/material";
import urunApi from '../../../api/urun-api.js';
import kategoriApi from '../../../api/kategori-api.js';
import gunlukApi from '../../../api/gunluk-api.js';

const palette = ['red', 'blue', 'green','yellow','pink','brown','purple','silver','gray','gold','dark blue','cyan', 'magenta', 'lime', 'olive', 'navy'];
const palette1 = ['pink','brown','purple','silver','gray','gold','dark blue','cyan', 'magenta', 'lime', 'olive', 'navy'];
const catList = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);
const logList = await gunlukApi.getGunlukler();
var firstDate,lastDate
let f1,f2
function setDate(fD,lD){
    f1=fD
    f2=lD
}
console.log("HOHOHOHO:"+f1)
var rangeData1 = catList.slice(0,4).map((label) => ({
    value: 0,
    label: label
}));
var rangeData2 = catList.slice(4,catList.length+1).map((label) => ({
  value: 0,
    label: label
}));
console.log(rangeData1)
console.log(rangeData2)
await filterByCatRange(f1,f2)
function convertDate(date){
    return new Date(date.split('.').reverse().join('-'))
}
console.log("İLK DATE DEĞERİ:"+firstDate)
async function filterByCatRange(date1,date2)
{
    console.log("Değerler1"+date1)
    console.log("Değerler2"+date2)
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))
    console.log(rangeLog)
    for (let j = 0; j < 4; j++) {
        let totalVal = 0;
        let count=0
        await Promise.all(rangeLog.map(async (rangeLog) => {
            const productCategory = await urunApi.getUrunByName(rangeLog.urun_isim);
             console.log(rangeLog[0])
            if (catList[j] === productCategory.kategori.isim) {
                count++
                totalVal += rangeLog.sevk;
            }
        }));
        
        rangeData1.find(predicate => predicate.label === catList[j]).value =totalVal
   
        
    }
    for (let j = 4; j < catList.length; j++) {
      let totalVal = 0;
      let count=0
      await Promise.all(rangeLog.map(async (rangeLog) => {
          const productCategory = await urunApi.getUrunByName(rangeLog.urun_isim);
           console.log(rangeLog[0])
          if (catList[j] === productCategory.kategori.isim) {
              count++
              totalVal += rangeLog.sevk;
          }
      }));
      
      rangeData2.find(predicate => predicate.label === catList[j]).value =totalVal
  }

}


export  function PieAnimation() {
  const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [radius, setRadius] = React.useState(50);
    const [itemNb, setItemNb] = React.useState(1);
    const [skipAnimation, setSkipAnimation] = useState(false)

    //fonksiyon


    setTimeout(function() {
        isRefreshed(false)
    }, 10000);

    firstDate = new Date(startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDate())
    lastDate = new Date(endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDate())
    useEffect(() => {
        const fetchData = async () => {
            try {
                // İlk date ve last date'i buraya taşıyabilirsiniz
                const firstDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
                const lastDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

                await filterByCatRange(startDate, endDate);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
    }, [firstDate,lastDate,itemNb]);

    function setValAnalyze(bool){
        setAnalyze(bool)
        isRefreshed(bool)
    }

  

    const close_datepicker = () => {
        setAnalyze(false);
    };
    
    const data1=rangeData1
    const data2=rangeData2


  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };
  const handleRadius = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setRadius(newValue);
  };

  return (
    <div className={"ChartsDate"}>
    <div>
       
            Filtrele:
            <div className={"dateArea"} style={{display:'flex'}}>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat='dd.MM.yyyy'
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat='dd.MM.yyyy'
                />
            </div>
            <Button onClick={() => setValAnalyze(true)} variant="contained" color="warning">ANALİZ</Button>

  

    </div>
    <div>
        {analyze && 
                         
        <Box sx={{ width: '100%' }}>
<PieChart
height={320}
colors={palette}
series={[
  { data: data1, outerRadius: radius },
  {
    data: data2.slice(0, itemNb),
    innerRadius: radius,
    //arcLabel: (params) => params.label ?? '',
  },
]}
skipAnimation={skipAnimation}
/>
<FormControlLabel
checked={skipAnimation}
control={
  <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
}
label="Animasyon"
labelPlacement="end"
/>
<Typography id="input-item-number" gutterBottom>
Ürün Sayısı
</Typography>
<Slider
value={itemNb}
onChange={handleItemNbChange}
valueLabelDisplay="auto"
min={1}
max={catList.length-5}
aria-labelledby="input-item-number"
/>
<Typography id="input-radius" gutterBottom>
Merkezin Büyüküğü
</Typography>
<Slider
value={radius}
onChange={handleRadius}
valueLabelDisplay="auto"
min={15}
max={100}
aria-labelledby="input-radius"
/>
</Box>

      

}</div>
</div>
  );
}

