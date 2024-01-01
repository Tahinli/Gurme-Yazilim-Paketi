import {
    DailyProductAnalyze,
    WeeklyProductAnalyze,
    MonthlyProductAnalyze,
    BarAnimationProduct
} from "./productAnalyze.jsx";
import {Card} from "@mui/joy";
import ControllableStates from "../CategoryAnalyzePage/getInputAutocomplete.jsx";
import {DateRangeProduct} from "./dateRangeProduct.jsx";
import React from "react";



export default function ProductPageAnalyze (){
    return(
        <div className={"mainAreaP"}>
            <div className={"maAreaP"}>
            </div>
            <div className={"maAreaP"}>
                <ControllableStates/>
            </div>
            <DateRangeProduct/>
            <div className='pie_charts'>
                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'30%'}}
                >
                    {<DailyProductAnalyze/>}

                </Card>
                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'30%'}}
                >
                    {<WeeklyProductAnalyze/>}


                </Card>
                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'30%'}}
                >
                    {<MonthlyProductAnalyze/>}

                </Card>

            </div>
            <br/>
            <div className={"maAreaP"}  >
                <Card 
                      color="neutral"
                      invertedColors={false}
                      orientation="horizontal"
                      size="lg"
                      variant="soft"
                      sx={{width:'100%', alignItems:'center'}}
                >
                    {<BarAnimationProduct/>}

                </Card>
            </div>



        </div>


    );
}