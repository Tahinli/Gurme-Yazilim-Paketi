import * as React from 'react';
import {PieChart} from "@mui/x-charts/PieChart";
import { dataJS } from '../dataJS';
import { Card } from '@mui/joy';

const parsedData= dataJS
let valCompleted,valGoal;

function getCurrentURL ()
{


    return window.location.href
}

// Example
const url = getCurrentURL().toString()


console.log(url)
const productNameVar=url.split("/")
let productName=productNameVar[4]
const date=new Date()
export const DateRangeProduct = () => {
    let totalGoal=0,totalCompleted=0
    let showChart=false
    const [value, setValue] = React.useState([
        new Date(),
        new Date()
    ]);
    const firstDate = new Date(value[0].getUTCFullYear(),value[0].getUTCMonth(),value[0].getUTCDate())
    const lastDate = new Date(value[1].getUTCFullYear(),value[1].getUTCMonth(),value[1].getUTCDate())

    const filterProduct = parsedData.filter(function (product) {

        let productDate = new Date(product.Year,product.Month-1,product.Day);

        return ((productDate>=firstDate&&productDate<=lastDate)&&product.Product === productName)

    });
    for(let i=0;i<filterProduct.length;i++){


        totalCompleted+=filterProduct[i].CompletedCount
        totalGoal+=filterProduct[i].GoalCount
    }



    valCompleted=totalCompleted
    valGoal=totalGoal
    const data = [
        { id: 0, value: valCompleted, label: 'Tamamlanan' },
        { id: 1, value: valGoal, label: 'Hedef' },

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






