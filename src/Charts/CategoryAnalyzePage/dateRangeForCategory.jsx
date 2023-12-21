import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import * as React from 'react';
import {PieChart} from "@mui/x-charts/PieChart";
import {dataJS} from "../dataJS.js";
import {Button, responsiveFontSizes} from "@mui/material";
import { Card } from '@mui/joy';
import CancelIcon from '@mui/icons-material/Cancel';

const parsedData= dataJS
let valHam,valDesert,valDrink;

export  function DateRangeP() {
    let totalHamR=0,totalDesertR=0,totalDrinkR=0;

    const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    //fonksiyon


    setTimeout(function() {
        isRefreshed(false)
    }, 5000);

    const firstDate = new Date(startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDate())
    const lastDate = new Date(endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDate())

    const hamR = parsedData.filter(function (product) {

        let productDate = new Date(product.Year,product.Month-1,product.Day);

        return ((productDate>=firstDate&&productDate<=lastDate)&&product.Category === "Hamur")

    });
    for(let i=0;i<hamR.length;i++){


        totalHamR+=(hamR[i].CompletedCount/hamR[i].GoalCount);
    }
    totalHamR/=hamR.length


    const icecekR = parsedData.filter(function (product) {
        let productDate = new Date(product.Year,product.Month-1,product.Day);

        return ((productDate>=firstDate&&productDate<=lastDate) && product.Category==="İçecek")
    });

    for(let i=0;i<icecekR.length;i++){
        totalDrinkR+=(icecekR[i].CompletedCount/icecekR[i].GoalCount);
    }
    totalDrinkR/=icecekR.length

    const tatliR = parsedData.filter(function (product) {
        let productDate = new Date(product.Year,product.Month-1,product.Day);

        return ((productDate>=firstDate&&productDate<=lastDate) && product.Category==="Tatlı")
    });
    for(let i=0;i<tatliR.length;i++){
        totalDesertR+=(tatliR[i].CompletedCount/tatliR[i].GoalCount);
    }
    totalDesertR/=tatliR.length
    function setValAnalyze(bool){
        setAnalyze(bool)
        isRefreshed(bool)
    }

    if(refresh){
        valHam=totalHamR
        valDesert=totalDesertR
        valDrink=totalDrinkR
    }

    const data = [
        { id: 0, value: valHam, label: 'Hamur' },
        { id: 1, value: valDesert, label: 'Tatlı' },
        { id: 2, value: valDrink, label: 'İçecek' },
    ];
    const close_datepicker = () => {
        setAnalyze(false);
      };

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
