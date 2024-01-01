import {DateRangeP} from "./dateRangeForCategory.jsx";
import ControllableStates from "./getInputAutocomplete.jsx";
import Button from '@mui/material/Button';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import './CategoryAnalyze.css';
import { useState } from 'react';

import {
    BarAnimation,
    CategoryDailyAnalyzeComp,
    CategoryMonthlyAnalyzeComp,
    CategoryWeeklyAnalyzeComp, TopFiveProduct,
} from "./CategoryAnalyzeComponents.jsx";
import {Card} from "@mui/joy";
import React from "react";


export function CategoryAnalyzeP(){
    const [showDetails,setDetails]= useState(true);

    const show_details= () => {
     setDetails(!showDetails);
    }
    return (
        <div >


            <Card
                className={"pie_card"}
                color="success"
                invertedColors={false}
                orientation="vertical"
                size="lg"
                variant="outlined"
                sx={{minimumWidth: '30%', paddingRight: '10px', height: '20%', width: '27.5%',minHeight:'20%'}}
            >
                <TopFiveProduct/>
            </Card>


            <br/>
            <div>

            <ControllableStates/>


            </div>

                <DateRangeP />


            <div className="pie_charts">


                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width: '30%'}}
                >
                    {<CategoryDailyAnalyzeComp/>}
                </Card>

                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width: '30%'}}
                >
                    {<CategoryWeeklyAnalyzeComp/>}
                </Card>




                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width: '30%'}}
                >


                    {<CategoryMonthlyAnalyzeComp/>}
                </Card>
            </div>

            <Button
                onClick={show_details}
                size='xlarge'
                color="error"
                variant="contained"
                aria-label="add"
            >
                {showDetails || false ? <ArrowCircleUpIcon/> : <ArrowCircleDownIcon/>}
            </Button>
            {showDetails && <Card
                className="detailed_chart"
                color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'100%', alignItems:'center'}}
                >
                    {<BarAnimation />}
                </Card>
            }
            <div>
            </div>
        </div>


    );
}