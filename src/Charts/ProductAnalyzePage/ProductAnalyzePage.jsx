import {
    DailyProductAnalyze,
    WeeklyProductAnalyze,
    MonthlyProductAnalyze,
    BarAnimationDaily
} from "./productAnalyze.jsx";
import {Card} from "@mui/joy";
import ControllableStates from "../CategoryAnalyzePage/getInputAutocomplete.jsx";
import {DateRangeProduct} from "./dateRangeProduct.jsx";
import React from "react";



export default function ProductPageAnalyze (){
    return(
        <div className={"mainAreaP"}>
            <div className={"maAreaP"}>
                <DateRangeProduct/>

            </div>
            <div className={"maAreaP"}>
                <ControllableStates/>
            </div>
            <div className={"maAreaP"}>
                <Card className={"Charts"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    {<DailyProductAnalyze/>}

                </Card>
                <Card className={"Charts"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    {<WeeklyProductAnalyze/>}


                </Card>
                <Card className={"Charts"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    {<MonthlyProductAnalyze/>}

                </Card>

            </div>
            <br/>
            <div className={"maAreaP"}  >
                <Card style={{width:'1600px'}}
                      color="neutral"
                      invertedColors={false}
                      orientation="horizontal"
                      size="lg"
                      variant="soft"
                >
                    {<BarAnimationDaily/>}

                </Card>
            </div>



        </div>


    );
}