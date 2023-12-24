import * as React from 'react';
import {PieChart} from "@mui/x-charts/PieChart";
import { Card } from '@mui/joy';
import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {Button} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import gunlukApi from "../../api/gunluk-api.js";
import urunApi from "../../api/urun-api.js";

const logList = await gunlukApi.getGunlukler();
const proList = (await urunApi.getUrunler()).map((urun) => urun.isim);

function getCurrentURL ()
{


    return window.location.href
}

const url = getCurrentURL().toString()

const productNameVar=url.split("/")
let proVal
//URLDEKİ DEĞERLERİ PARÇAYA AYIRDIKTAN SONRA SON DEĞERİN ATAMISINI YAPTIM DİLENİRSE DAHA FARKLI BİR BİÇİMDE MODİFİYE EDİLEBİLİR

let productName=productNameVar[4]
//TÜRKÇE KARAKTERLERİ DÖNÜŞTÜRDÜM
for(let i=0;i<proList.length;i++){
    proVal=proList[i].replaceAll('Ğ','g')
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
const rangeData = [
    { id: 0, value: 0, label: 'Başarılı' },
    { id: 1, value: 0, label: 'Başarısız' },

];
await filterByProRange()
function convertDate(date){
    return new Date(date.split('.').reverse().join('-'))
}

async function filterByProRange(date1,date2)
{
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2))
    let totalVal = 0;
    let count=0
    await Promise.all(rangeLog.map(async (rangeLog) => {
        const productCategory = await urunApi.getUrunByName(rangeLog.urun_isim);

        if (proVal=== productCategory.isim) {
            count++
            totalVal += rangeLog.ulasilan / rangeLog.hedeflenen;
        }
    }));
    totalVal=(totalVal/count)*100;
    let fail=100-totalVal
    if(fail<0){
        fail=0
    }

    rangeData.find(predicate => predicate.label === "Başarılı").value = totalVal
    rangeData.find(predicate => predicate.label === "Başarısız").value = fail


}

const date=new Date()
export  function DateRangeProduct() {


    const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    //fonksiyon


    setTimeout(function() {
        isRefreshed(false)
    }, 5000);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await filterByProRange(startDate, endDate);
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







