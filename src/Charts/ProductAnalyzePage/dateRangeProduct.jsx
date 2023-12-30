import * as React from 'react';
import {PieChart} from "@mui/x-charts/PieChart";
import { Card } from '@mui/joy';
import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {Button} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import gunlukApi from "../../api/gunluk-api.js";
import urunApi from "../../api/urun-api.js";
import { logList,productList } from '../CategoryAnalyzePage/CategoryAnalyzeComponents.jsx';


const proList = productList.map((urun) => urun.isim);

function getCurrentURL ()
{


    return window.location.href
}
function getTodayDate() {
    const today = new Date();
    // today.setDate(today.getDate() + 1); // Bugünün tarihine bir gün ekler
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return today.toLocaleDateString('tr-TR', options);
}

const url = getCurrentURL().toString()

const productNameVar=url.split("/")
let proVal
//URLDEKİ DEĞERLERİ PARÇAYA AYIRDIKTAN SONRA SON DEĞERİN ATAMISINI YAPTIM DİLENİRSE DAHA FARKLI BİR BİÇİMDE MODİFİYE EDİLEBİLİR

let productName=productNameVar[4]
console.log(productName)
//TÜRKÇE KARAKTERLERİ DÖNÜŞTÜRDÜM
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
    const rangeLog=logList.filter(gunluk=>(convertDate(gunluk.tarih)>=date1&&convertDate(gunluk.tarih)<=date2)&&gunluk.sevk!==0&&gunluk.stok!==0&&gunluk.personel_sayisi!==0)
    let totalVal = 0;
    let count=0
    rangeLog.map(async (rLog) => {
        const productCategory = productList.filter(r=>r.isim===rLog.urun_isim);

        if (proVal=== productCategory[0].isim) {
            count++
            totalVal += rLog.ulasilan / rLog.hedeflenen;
        }
    });
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
    const [startDate, setStartDate] = useState(convertDate(getTodayDate()));
    const [endDate, setEndDate] = useState(convertDate(getTodayDate()));

    //fonksiyon


    setTimeout(function() {
        isRefreshed(false)
    }, 1000);

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


    return (
            <div>
            <div>
                <Card 
                   style={{width: '450px',height: '100%'}}
                    sx={{alignItems:'center'}}
                    color="neutral"
                    invertedColors={false}
                    orientation="vertical"
                    size="lg"
                    variant="soft"
                    className={"Date_part"}
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
                        async () => await filterByCatRange()}} variant="contained" color="warning"
                    >ANALİZ
                    </Button>
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
    );
}







