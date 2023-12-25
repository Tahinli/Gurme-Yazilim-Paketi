import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useEffect, useState} from "react";
import * as React from 'react';
import {PieChart} from "@mui/x-charts/PieChart";
import {Button, responsiveFontSizes} from "@mui/material";
import { Card } from '@mui/joy';
import CancelIcon from '@mui/icons-material/Cancel';
import urunApi from "../../api/urun-api.js";
import kategoriApi from "../../api/kategori-api.js";
import gunlukApi from "../../api/gunluk-api.js";
const catList = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);
const logList = await gunlukApi.getGunlukler();
var firstDate,lastDate
let f1,f2
function setDate(fD,lD){
    f1=fD
    f2=lD
}
console.log("HOHOHOHO:"+f1)
var rangeData1 = catList.map((label, index) => ({
    id: index,
    value: 0,
    label: label
}));
var rangeData2 = catList.map((label, index) => ({
    id: index,
    value: 0,
    label: label
}));
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
    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        await Promise.all(rangeLog.map(async (rangeLog) => {
            const productCategory = await urunApi.getUrunByName(rangeLog.urun_isim);

            if (catList[j] === productCategory.kategori.isim) {
                count++
                totalVal += rangeLog.stok;
            }
        }));
        if(j<4)
        rangeData1.find(predicate => predicate.label === catList[j]).value = (totalVal);
        else 
        rangeData2.find(predicate => predicate.label === catList[j]).value = (totalVal);
    }

}

export  function DateRangeP() {
  
    const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    //fonksiyon


    setTimeout(function() {
        isRefreshed(false)
    }, 5000);

    firstDate = new Date(startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDate())
    lastDate = new Date(endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDate())
    useEffect(() => {
        const fetchData = async () => {
            try {
                // İlk date ve last date'i buraya taşıyabilirsiniz
                const firstDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
                const lastDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

                await filterByCatRange(firstDate, lastDate);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
    }, [firstDate,lastDate]);

    function setValAnalyze(bool){
        setAnalyze(bool)
        isRefreshed(bool)
    }

    if(refresh){
        valHam=totalHamR
        valDesert=totalDesertR
        valDrink=totalDrinkR
    }

    const data=rangeData
    const close_datepicker = () => {
        setAnalyze(false);
    };
    
    const data1=rangeData1
    const data2=rangeData2
    return (
        <div className={"ChartsDate"}>
            <div>
                <Card style={{width: '30%', height: '150px'}}
                      sx={{alignItems:'center'}}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    Filtrele:
                    <div className={"dateArea"} style={{display:'flex'}}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                        />
                    </div>
                    <Button onClick={() => setValAnalyze(true)} variant="contained" color="warning">ANALİZ</Button>

                </Card>

            </div>
            <div>
                {analyze && <Card className={"Charts"} style={{width: '65%', height: '400px', marginTop:15}}
                                  color="neutral"
                                  invertedColors={false}
                                  orientation="vertical"
                                  size="lg"
                                  variant="soft"
                >
                    <CancelIcon onClick={close_datepicker} variant="contained" color="warning"/>

                    <h4 style={{paddingRight: '100px'}}>Seçilen Aralıktaki Verimlilik</h4>
                    <Box sx={{ width: '100%' }}>
      <PieChart
        height={300}
        series={[
          { data: data1, outerRadius: radius },
          {
            data: data2.slice(0, itemNb),
            innerRadius: radius,
            arcLabel: (params) => params.label ?? '',
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
        max={catList.length}
        aria-labelledby="input-item-number"
      />
      <Typography id="input-radius" gutterBottom>
        Kategori
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
 
                </Card>}

            </div>
        </div>


    )
        ;
}
