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

var rangeData = catList.map((label, index) => ({
    id: index,
    value: 0,
    label: label
}));

function convertDate(date){
    return new Date(date.split('.').reverse().join('-'))
}
//DATE VERİLDİKTEN SONRA DEĞERLER BURADA FİLTRELENİP GÜNCELLENİYOR
async function filterByCatRange(date1,date2)
{
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))
    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
        await Promise.all(rangeLog.map(async (rangeLog) => {
            const productCategory = await urunApi.getUrunByName(rangeLog.urun_isim);

            if (catList[j] === productCategory.kategori.isim) {
                count++
                totalVal += rangeLog.ulasilan / rangeLog.hedeflenen;
            }
        }));

        rangeData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;
    }

}

export  function DateRangeP() {


    const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());




    setTimeout(function() {
        isRefreshed(false)
    }, 5000);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // İlk date ve last date'i buraya taşıyabilirsiniz


                await filterByCatRange(startDate, endDate);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
    }, [startDate,endDate,refresh]);

    function setValAnalyze(bool){
        setAnalyze(bool)
        isRefreshed(bool)
    }


    const data=rangeData
    const close_datepicker = () => {
        setAnalyze(false);
    };
    useEffect(() => {
        console.log('Gunlukler :>> ', logList);
    }, [logList]);

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
                    <Button onClick={() =>{ setValAnalyze(true)
                        async () => await filterByCatRange()}} variant="contained" color="warning">ANALİZ</Button>

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
                    <PieChart
                        series={[
                            {
                                data,
                                highlightScope: {faded: 'global', highlighted: 'item'},
                                faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                            },
                        ]}
                        height={300}
                    />
                </Card>}

            </div>
        </div>


    )
        ;
}
