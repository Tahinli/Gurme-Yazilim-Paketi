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
import { padding } from '@mui/system';
import { catList,logList,productList } from '../../../Charts/CategoryAnalyzePage/CategoryAnalyzeComponents.jsx';
import Card from "@mui/joy/Card";

const palette = ['#FF6347', '#C24641', '#2F0909','#7E354D','#FC6C85','#733635','#7D0541','silver','#7E587E','#6F2DA8','#4E5180','#E9CFEC', 'magenta', 'lime', 'olive', 'navy'];
//const palette1 = ['pink','brown','purple','silver','gray','gold','dark blue','cyan', 'magenta', 'lime', 'olive', 'navy'];

var firstDate,lastDate
let f1,f2
const firstpart=Math.ceil(catList.length*(1/4));

function setDate(fD,lD){
    f1=fD
    f2=lD
}

var rangeData1 = catList.slice(0,firstpart).map((label) => ({
    value: 0,
    label: label
}));
var rangeData2 = catList.slice(firstpart,catList.length).map((label) => ({
  value: 0,
    label: label
}));

function getTodayDate() {
  const today = new Date();
  // today.setDate(today.getDate() + 1); // Bugünün tarihine bir gün ekler
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return today.toLocaleDateString('tr-TR', options);
}

function convertDate(date){
  return new Date(date.split('.').reverse().join('-'))
}

await filterByCatRange(f1,f2)


async function filterByCatRange(date1,date2)
{ 
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))
    for (let j = 0; j < firstpart; j++) {
        let totalVal = 0;
        let count=0
        rangeLog.map(async (rangeLog) => {
            const productCategory = productList.filter(r=>r.isim===rangeLog.urun_isim);
            if (catList[j] === productCategory[0].kategori.isim) {
                count++
                totalVal += rangeLog.stok;
            }
        });
        try{
           rangeData1.find(predicate => predicate.label === catList[j]).value =totalVal
        }
        catch (e) {
          console.log(e)
        }
        
   
        
    }
    for (let j = firstpart; j < catList.length; j++) {
      let totalVal = 0;
      let count=0
      rangeLog.map(async (rangeLog) => {
          const productCategory = productList.filter(r=>r.isim===rangeLog.urun_isim);
          if (catList[j] === productCategory[0].kategori.isim) {
              count++
              totalVal += rangeLog.stok;
          }
      });
      
      rangeData2.find(predicate => predicate.label === catList[j]).value =totalVal
  }

}


export  function PieAnimation() {
  const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(convertDate(getTodayDate()));
    const [endDate, setEndDate] = useState(convertDate(getTodayDate()));
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
    <div>
    <div style={{display:'flex' , flexDirection:'column', color:'black'}}>
               <Card  className={"Date_part"}
                      style={{width: '450px',height: '20%'}}
                      sx={{alignItems:'center',marginLeft:10}}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="solid"
                >
              
              <h4 className="stokislem_1">STOK ANALİZİ</h4>
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
            <Button onClick={() => setValAnalyze(true)} variant="contained" color="warning" className='stock_analyzebtn'>ANALİZ</Button>
            </Card>
    </div>
    
    <div>
        {analyze &&         
        <Card className="input_card11"
        color="warning"
        orientation="horizontal"
        size="lg"
        variant="soft"
        sx={{display:'flex', flexDirection:'column'}}
        >
        <PieChart
          height={300}
          colors={palette}
          series={[
            { data: data1, outerRadius: radius },
            {
              data: data2.slice(0, itemNb),
              innerRadius: radius,
         
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
        min={firstpart}
        sx={{width:'70%'}}
        max={catList.length-firstpart}
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
        sx={{width:'50%'}}
        aria-labelledby="input-radius"
        />
        </Card>
       }
        </div>
        </div>
  );
}

