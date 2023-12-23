import * as React from 'react';
import {PieChart} from "@mui/x-charts/PieChart";
import { dataJS } from '../dataJS';
import { Card } from '@mui/joy';
import {useState} from "react";
import DatePicker from "react-datepicker";
import {Button} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

const parsedData= dataJS
let valCompleted,valGoal;

function getCurrentURL ()
{


    return window.location.href
}

// Example
const url = getCurrentURL().toString()

const productNameVar=url.split("/")
let productName=productNameVar[4]
const date=new Date()
export const DateRangeProduct = () => {
    let totalGoal=0,totalCompleted=0
    let showChart=false
    const[analyze,setAnalyze]=useState(false)
    const[refresh,isRefreshed]=useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    setTimeout(function() {
        isRefreshed(false)
    }, 5000);

    const firstDate = new Date(startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDate())
    const lastDate = new Date(endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDate())

    const filterProduct = parsedData.filter(function (product) {

        let productDate = new Date(product.Year,product.Month-1,product.Day);

        return ((productDate>=firstDate&&productDate<=lastDate)&&product.Product === productName)

    });
    for(let i=0;i<filterProduct.length;i++){


        totalCompleted+=filterProduct[i].CompletedCount
        totalGoal+=filterProduct[i].GoalCount
    }
    function setValAnalyze(bool){
        setAnalyze(bool)
        isRefreshed(bool)

    }
    if(refresh){
        valCompleted=totalCompleted
        valGoal=totalGoal
    }
    const data = [
        { id: 0, value: valCompleted, label: 'Tamamlanan' },
        { id: 1, value: valGoal, label: 'Hedef' },

    ];
    const close_datepicker = () => {
        setAnalyze(false);
      };


    return (
        <div className={"ChartsDate"}>

            <div style={{display:'flex'}}>
            <div className={"dateArea"}>
                <Card 
                    style={{width: '30%',minWidth:'100%', height: '150px'}}
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
                    <div className={"dateArea"}>
                    <Button onClick={() => setValAnalyze(true)} variant="contained" color="warning">ANALİZ</Button>
                    </div>
                </Card>

            </div>
            <div>
                {analyze && <Card  style={{width: '100%',minWidth:'100%', height: '400px'}}
                               
                               color="warning"
                               invertedColors={false}
                               orientation="vertical"
                               size="lg"
                               variant="soft"
                >
                    <CancelIcon onClick={close_datepicker} variant="contained" color="warning"/>

                    <h4>Seçilen Aralıktaki Verimlilik</h4>
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
            
            </div>
            


 


    )
        ;
};






