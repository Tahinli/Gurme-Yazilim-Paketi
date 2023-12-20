import {DateRangeP} from "./dateRangeForCategory.jsx";
import ControllableStates from "./getInputAutocomplete.jsx";
import {
    BarAnimation,
    CategoryDailyAnalyzeComp,
    CategoryMonthlyAnalyzeComp,
    CategoryWeeklyAnalyzeComp,
    InfoValues
} from "./CategoryAnalyzeComponents.jsx";
import {Card} from "@mui/joy";
import React from "react";

export function CategoryAnalyzeP(){

    return (
        <div  className={"mainArea"}>
            <div>

            </div>
            <div className={"ChartsDiv"}>

              
                <ControllableStates/>
                <InfoValues/>

            </div>
            <br/>
            <div className={"ChartsDiv"} >

                <Card className={"Charts"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    {<CategoryDailyAnalyzeComp />}

                </Card>
                <Card className={"Charts"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    {<CategoryWeeklyAnalyzeComp />}


                </Card>
                <Card className={"Charts"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    {<CategoryMonthlyAnalyzeComp />}

                </Card>


            </div>
            <br/>
            <div>
                <Card className={"Charts"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                >
                    {<BarAnimation />}

                </Card>
            </div>
            <div>

            </div>
        </div>


    );
}