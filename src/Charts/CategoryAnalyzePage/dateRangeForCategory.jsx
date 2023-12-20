import React, {useState} from 'react';
import { dataJS } from '../dataJS';
import {Card} from "@mui/joy";
import {PieChart} from "@mui/x-charts/PieChart";
const parsedData= dataJS
let valHam,valDesert,valDrink;

const date=new Date()
export const DateRangeP = () => {
    let totalHamR=0,totalDesertR=0,totalDrinkR=0;
    let showChart=false
    const [value, setValue] = React.useState([
        new Date(),
        new Date()
    ]);
    const firstDate = new Date(value[0].getUTCFullYear(),value[0].getUTCMonth(),value[0].getUTCDate())
    const lastDate = new Date(value[1].getUTCFullYear(),value[1].getUTCMonth(),value[1].getUTCDate())

    const hamR = parsedData.filter(function (product) {

        let productDate = new Date(product.Year,product.Month-1,product.Day);

        return ((productDate>=firstDate&&productDate<=lastDate)&&product.Category === "Hamur")

    });
    for(let i=0;i<hamR.length;i++){


        totalHamR+=(hamR[i].CompletedCount/hamR[i].GoalCount);
    }
    totalHamR/=hamR.length
    console.log(hamR.length)

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
    valHam=totalHamR
    valDesert=totalDesertR
    valDrink=totalDrinkR
    const data = [
        { id: 0, value: valHam, label: 'Hamur' },
        { id: 1, value: valDesert, label: 'Tatlı' },
        { id: 2, value: valDrink, label: 'İçecek' },
    ];
    if(value[0]<date&&value[1]<=date){
        showChart=true
    }
console.log("Tarih değeri"+date+"val"+value[0])
    return (
        <div className={"ChartsDate"}>
            <div><Card className={"Charts"}
                orientation="vertical"
                size="lg"
                variant="soft"
            >
                
            </Card>

            </div>
            <br/>
            <div>
                {showChart&& <Card className={"Charts"} style={{width: '400px', height: '400px'}}
                                  color="neutral"
                                  invertedColors={false}
                                  orientation="vertical"
                                  size="lg"
                                  variant="soft"
                >
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
};




