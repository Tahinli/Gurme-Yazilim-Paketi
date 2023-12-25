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
import { logList,catList,productList} from "./CategoryAnalyzeComponents.jsx";

var rangeData = catList.map((label, index) => ({
    id: index,
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
//DATE VERİLDİKTEN SONRA DEĞERLER BURADA FİLTRELENİP GÜNCELLENİYOR
async function filterByCatRange(date1,date2)
{
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))
    for (let j = 0; j < catList.length; j++) {
        let totalVal = 0;
        let count=0
       rangeLog.map(async (rangeLog) => {
            const productCategory = productList.filter(r=>r.isim===rangeLog.urun_isim);

            if (catList[j] === productCategory[0].kategori.isim) {
                count++
                totalVal += rangeLog.ulasilan / rangeLog.hedeflenen;
            }
        });

        rangeData.find(predicate => predicate.label === catList[j]).value = (totalVal/count)*100;
    }

}

export  function DateRangeP() {


    const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(convertDate(getTodayDate()));
    const [endDate, setEndDate] = useState(convertDate(getTodayDate()));



    setTimeout(function() {
        isRefreshed(false)
    }, 1000);

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


    return (
        <div >
            <div>
                <Card className={"Date_part"}
                      style={{width: '450px',height: '20%'}}
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
                    <Button onClick={() =>{ setValAnalyze(true)}} variant="contained" color="warning">ANALİZ</Button>

                </Card>

            </div>
            <div>
                {analyze && <Card className={"Charts"} style={{width: '65%' ,height: '400px', marginTop:15}} sx={{minWidth:325}}
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
